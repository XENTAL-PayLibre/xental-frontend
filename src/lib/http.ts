import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_ENDPOINTS } from '@/api/api-endpoints';
import { getApiBaseUrl } from '@/lib/api-base-url';
import {
  getToken,
  getRefreshToken,
  isAccessTokenExpired,
  invalidateAccessTokenCache,
  setToken,
  logoutUser,
} from './get-token';
import { refreshSessionAction } from '@/actions/auth';

// ── Types ──────────────────────────────────────────────────────────────────
export type ErrorData = {
  message: string;
};

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// ── Singleton & shared refresh promise ────────────────────────────────────
let apiInstance: AxiosInstance | null = null;
let refreshPromise: Promise<string | null> | null = null;

/** Call after login so a prior failed refresh doesn't block the new session. */
export function resetAuthRefreshState() {
  refreshPromise = null;
  invalidateAccessTokenCache();
}

// ── Helpers ────────────────────────────────────────────────────────────────
function isAuthEndpoint(url: string) {
  return (
    url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
    url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
    url.includes(API_ENDPOINTS.AUTH.REFRESH)
  );
}

function setAuthHeader(config: InternalAxiosRequestConfig, token: string) {
  if (typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
}

function shouldProactivelyRefresh(token: string | null): boolean {
  if (!token) return true;
  return isAccessTokenExpired();
}

// ── Coalesced refresh ──────────────────────────────────────────────────────
function coalescedRefresh(): Promise<string | null> {
  refreshPromise ??= refreshSessionAction()
    .then((result) => {
      if (result.success && result.accessToken) {
        setToken('access_token', result.accessToken, result.expiresIn);
        return result.accessToken;
      }
      if (result.reason === 'server_error') throw new Error('server_error');
      return null;
    })
    .catch((err) => {
      throw err instanceof Error ? err : new Error('server_error');
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

// ── 401 handler ────────────────────────────────────────────────────────────
async function handleUnauthorized(
  error: AxiosError,
  originalRequest: RetryableConfig,
): Promise<unknown> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logoutUser();
    return Promise.reject(error);
  }

  originalRequest._retry = true;
  invalidateAccessTokenCache();

  // If a refresh is already in flight, wait for it
  const activeRefresh = refreshPromise;
  if (activeRefresh) {
    try {
      const newToken = await activeRefresh;
      if (!newToken) { logoutUser(); return Promise.reject(error); }
      setAuthHeader(originalRequest, newToken);
      return getApi()(originalRequest);
    } catch {
      logoutUser();
      return Promise.reject(error);
    }
  }

  try {
    const newToken = await coalescedRefresh();
    if (!newToken) { logoutUser(); return Promise.reject(error); }
    setAuthHeader(originalRequest, newToken);
    return getApi()(originalRequest);
  } catch {
    logoutUser();
    return Promise.reject(error);
  }
}

// ── Axios singleton factory ────────────────────────────────────────────────
function getApi(): AxiosInstance {
  if (apiInstance) return apiInstance;

  apiInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
  });

  // Request interceptor — attach access token (proactively refreshes if expired)
  apiInstance.interceptors.request.use(
    async (config) => {
      const url = String(config.url ?? '');
      if (!isAuthEndpoint(url)) {
        const token = getToken();
        if (token && !shouldProactivelyRefresh(token)) {
          setAuthHeader(config, token);
        } else if (getRefreshToken()) {
          try {
            const fresh = await coalescedRefresh();
            if (fresh) setAuthHeader(config, fresh);
          } catch {
            // proceed without token; 401 handler will catch it
          }
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor — handle 401 with token refresh
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as RetryableConfig | undefined;
      const url = String(originalRequest?.url ?? '');

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthEndpoint(url)
      ) {
        return Promise.reject(error);
      }

      return handleUnauthorized(error, originalRequest);
    },
  );

  return apiInstance;
}

// ── Request helpers ────────────────────────────────────────────────────────
export const getRequest = async <T>(params: { url: string; signal?: AbortSignal }) => {
  const { data } = await getApi().get<T>(params.url, { signal: params.signal });
  return data;
};

export const postRequest = async <T, P>(params: {
  url: string;
  payload: P;
  signal?: AbortSignal;
}) => {
  return getApi().post<T>(params.url, params.payload, { signal: params.signal });
};

export const patchRequest = async <T, P>(params: { url: string; payload: P }) => {
  return getApi().patch<T>(params.url, params.payload);
};

export const deleteRequest = async <T>(params: { url: string }) => {
  const { data } = await getApi().delete<T>(params.url);
  return data;
};
