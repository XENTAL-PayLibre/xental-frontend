// Xental API paths (relative to NEXT_PUBLIC_API_URL/api/v1).

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER:        '/developers/register',
    LOGIN:           '/developers/login',
    REFRESH:         '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD:  '/auth/reset-password',
    VERIFY_EMAIL:    '/developers/verify-email',
  },
} as const;
