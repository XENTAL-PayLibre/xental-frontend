'use server';

import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/lib/api-base-url';
import { API_ENDPOINTS } from '@/api/api-endpoints';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function cookieOptions(httpOnly: boolean) {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };
}

/**
 * Securely write auth cookies on the server after a successful login/register.
 * The refresh_token is httpOnly — JS cannot read it, only the server can.
 */
export async function loginSessionAction(
  accessToken: string,
  refreshToken: string,
  expiresIn?: number,
): Promise<void> {
  const cookieStore = await cookies();

  // Readable by client JS (axios needs it for request headers)
  cookieStore.set('access_token', accessToken, cookieOptions(false));

  // httpOnly — only readable by Server Actions / Route Handlers
  cookieStore.set('refresh_token', refreshToken, cookieOptions(true));

  // Sentinel flag so client knows a refresh token exists without reading it
  cookieStore.set('has_refresh_token', 'true', cookieOptions(false));

  if (expiresIn) {
    cookieStore.set(
      'access_token_expires_at',
      String(Date.now() + expiresIn * 1000),
      cookieOptions(false),
    );
  }
}

/**
 * Server-side token refresh. Reads the httpOnly refresh_token cookie,
 * calls the backend refresh endpoint, and returns the new access token.
 */
export async function refreshSessionAction(): Promise<{
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  reason?: string;
}> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return { success: false, reason: 'no_refresh_token' };
  }

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      return { success: false, reason: 'server_error' };
    }

    const json = await res.json();
    const accessToken: string = json?.data?.access_token;
    const expiresIn: number   = json?.data?.expires_in;

    if (!accessToken) {
      return { success: false, reason: 'no_access_token' };
    }

    // Rotate access token cookie
    cookieStore.set('access_token', accessToken, cookieOptions(false));
    if (expiresIn) {
      cookieStore.set(
        'access_token_expires_at',
        String(Date.now() + expiresIn * 1000),
        cookieOptions(false),
      );
    }

    return { success: true, accessToken, expiresIn };
  } catch {
    return { success: false, reason: 'server_error' };
  }
}

// Clears all auth cookies on the server (used on logout).
export async function clearSessionAction(): Promise<void> {
  const cookieStore = await cookies();
  ['access_token', 'refresh_token', 'has_refresh_token', 'access_token_expires_at'].forEach(
    (key) => cookieStore.delete(key),
  );
}
