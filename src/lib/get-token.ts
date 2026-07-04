import Cookies from 'universal-cookie';

const cookies = new Cookies();

// ── Cookie key names ───────────────────────────────────────────────────────
export const COOKIE_KEYS = {
  access_token:  'xnt_access',
  refresh_token: 'xnt_refresh',
  has_refresh:   'has_refresh_token',
  user_profile:  'user_profile',
} as const;

const ACCESS_TOKEN_EXPIRY_KEY = 'access_token_expires_at';

// In-memory cache to avoid repeated cookie parses on every request.
let cachedToken: string | null = null;

export function invalidateAccessTokenCache() {
  cachedToken = null;
}

// ── Access token expiry (stored in sessionStorage) ─────────────────────────
export function setAccessTokenExpiry(expiresInSeconds: number) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
}

export function isAccessTokenExpired(bufferMs = 30_000): boolean {
  if (typeof window === 'undefined') return false;
  const raw = sessionStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
  if (!raw) return false;
  return Date.now() >= Number(raw) - bufferMs;
}

// ── Token getters ──────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (cachedToken) return cachedToken;
  if (typeof window !== 'undefined') {
    cachedToken = cookies.get(COOKIE_KEYS.access_token) ?? null;
  }
  return cachedToken;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = cookies.get(COOKIE_KEYS.refresh_token);
  if (token) return token;
  // Fallback: cookie is httpOnly so we check the sentinel flag
  const hasSentinel =
    cookies.get(COOKIE_KEYS.has_refresh) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem(COOKIE_KEYS.has_refresh));
  return hasSentinel === 'true' || hasSentinel === true ? 'true' : null;
}

export function getCookie(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return cookies.get(key) ?? null;
}

// ── Token setters ──────────────────────────────────────────────────────────
export function setToken(key: string, value: string, maxAgeSeconds?: number) {
  const isAccess = key === COOKIE_KEYS.access_token;
  const maxAge = maxAgeSeconds ?? 7 * 24 * 60 * 60;

  cookies.set(key, value, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });

  if (isAccess) {
    cachedToken = value;
    if (maxAgeSeconds) setAccessTokenExpiry(maxAgeSeconds);
  }
}

export function removeToken(key: string) {
  cookies.remove(key, { path: '/' });
  if (key === COOKIE_KEYS.access_token) cachedToken = null;
}

/**
 * Mark an active session with a first-party, readable cookie the Next proxy (middleware) can see.
 * The real session (xnt_access/xnt_refresh) is HttpOnly and lives on the API's domain, so it is
 * invisible to the frontend origin when they differ (e.g. localhost dev → staging API). This
 * sentinel is what gates the dashboard routes; it is cleared on logout.
 */
export const SESSION_SENTINEL = 'xnt_session';

export function markSession(days = 14) {
  if (typeof window === 'undefined') return;
  cookies.set(SESSION_SENTINEL, '1', { path: '/', sameSite: 'lax', maxAge: days * 24 * 60 * 60 });
}

// ── Auth cleanup & logout ──────────────────────────────────────────────────
export function clearAuthCookies() {
  invalidateAccessTokenCache();
  removeToken(COOKIE_KEYS.access_token);
  removeToken(COOKIE_KEYS.refresh_token);
  removeToken(COOKIE_KEYS.has_refresh);
  removeToken(COOKIE_KEYS.user_profile);
  cookies.remove(SESSION_SENTINEL, { path: '/' });
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(COOKIE_KEYS.has_refresh);
  }
}

export function logoutUser(redirectPath = '/login') {
  clearAuthCookies();
  if (typeof window === 'undefined') return;
  window.location.replace(redirectPath);
}
