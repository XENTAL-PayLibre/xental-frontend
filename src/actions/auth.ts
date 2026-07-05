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
  cookieStore.set('xnt_access', accessToken, cookieOptions(false));

  // httpOnly — only readable by Server Actions / Route Handlers
  cookieStore.set('xnt_refresh', refreshToken, cookieOptions(true));

  // Sentinel flag so client knows a refresh token exists without reading it
  cookieStore.set('has_refresh_token', 'true', cookieOptions(false));

  const effectiveExpiry = expiresIn ?? 900;
  cookieStore.set(
    'access_token_expires_at',
    String(Date.now() + effectiveExpiry * 1000),
    cookieOptions(false),
  );
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
  const refreshToken = cookieStore.get('xnt_refresh')?.value;

  if (!refreshToken) {
    return { success: false, reason: 'no_refresh_token' };
  }

  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'https://api.staging.xental.online';
    const res = await fetch(`${API_BASE}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `xnt_refresh=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return { success: false, reason: 'server_error' };
    }

    // Backend sets new cookies in Set-Cookie headers — extract xnt_access value
    const setCookies = res.headers.getSetCookie?.() ?? [];
    let accessToken: string | undefined;

    for (const raw of setCookies) {
      const match = raw.match(/^xnt_access=([^;]+)/);
      if (match) {
        accessToken = match[1];
        // Write it as a readable (non-httpOnly) cookie so JS/axios can use it
        cookieStore.set('xnt_access', accessToken, cookieOptions(false));
      }
      const refreshMatch = raw.match(/^xnt_refresh=([^;]+)/);
      if (refreshMatch) {
        cookieStore.set('xnt_refresh', refreshMatch[1], cookieOptions(true));
      }
    }

    if (!accessToken) {
      return { success: false, reason: 'no_access_token' };
    }

    return { success: true, accessToken };
  } catch {
    return { success: false, reason: 'server_error' };
  }
}

// Clears all auth cookies on the server (used on logout).
export async function clearSessionAction(): Promise<void> {
  const cookieStore = await cookies();
  ['xnt_access', 'xnt_refresh', 'has_refresh_token', 'access_token_expires_at'].forEach(
    (key) => cookieStore.delete(key),
  );
}
