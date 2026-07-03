'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { postRequest, resetAuthRefreshState } from '@/lib/http';
import { markSession, clearAuthCookies } from '@/lib/get-token';
import { API_ENDPOINTS } from './api-endpoints';
import type { RegisterPayload, RegisterResponse, LoginPayload, LoginResponse } from './types/auth';

// ── Shared helpers ─────────────────────────────────────────────────────────

function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
  statusMap?: Record<number, string>
): string {
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as { response?: { data?: { message?: string; detail?: string }; status?: number } };
    
    // 1. Check if the specific API hook provided a custom message for this status code
    const status = axiosError.response?.status;
    if (status && statusMap?.[status]) {
      return statusMap[status];
    }

    // 2. Fall back to the message provided by the backend
    // RFC 7807 problem detail (used by 409 and other error responses)
    const fromDetail = axiosError.response?.data?.detail;
    if (fromDetail) return fromDetail;
    const fromBody = axiosError.response?.data?.message;
    if (fromBody) return fromBody;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function displayError(error: unknown, fallback?: string, statusMap?: Record<number, string>) {
  console.error('[API Error]', error);
  toast.error(getErrorMessage(error, fallback, statusMap));
}

// ── useSignup ──────────────────────────────────────────────────────────────
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'signup'],
    mutationFn: (payload: RegisterPayload) =>
      postRequest<RegisterResponse, RegisterPayload>({
        url: API_ENDPOINTS.AUTH.REGISTER,
        payload,
      }),

    onSuccess(response, variables) {
      // 201: account created — no tokens returned, email verification required
      // We route them to the dedicated "check your email" pending page.
      const encodedEmail = encodeURIComponent(variables.email);
      router.push(`/verify-email?email=${encodedEmail}`);
    },

    onError(error) {
      displayError(error, 'Unable to create account. Please try again.', {
        409: 'An account with this email already exists.',
      });
    },
  });
}

// ── useLogin ───────────────────────────────────────────────────────────────
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginPayload) =>
      postRequest<LoginResponse, LoginPayload>({
        url: API_ENDPOINTS.AUTH.LOGIN,
        payload,
      }),

    async onSuccess() {
      resetAuthRefreshState();

      // The real session cookies are HttpOnly + on the API's domain (invisible to this origin
      // when they differ, e.g. localhost → staging API). Set a first-party sentinel cookie so the
      // Next proxy/middleware can gate the dashboard routes.
      markSession();

      toast.success('Welcome back!');
      router.push('/dashboard');
    },

    onError(error) {
      displayError(error, 'Unable to sign in. Check your email and password.', {
        401: 'Invalid email or password.',
        403: 'Email not verified. Please check your inbox.',
      });
    },
  });
}

// ── useLogout ──────────────────────────────────────────────────────────────
export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    // Best-effort server logout: revokes the refresh token and clears the HttpOnly
    // xnt_access / xnt_refresh cookies. We clear the local sentinel + redirect regardless,
    // so a failed network call can never trap the user in a session.
    mutationFn: () =>
      postRequest<void, Record<string, never>>({ url: API_ENDPOINTS.AUTH.LOGOUT, payload: {} }),
    onSettled() {
      clearAuthCookies();
      qc.clear();
      if (typeof window !== 'undefined') window.location.replace('/login');
    },
  });
}

