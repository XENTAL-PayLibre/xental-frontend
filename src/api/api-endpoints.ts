// Xental API paths (relative to NEXT_PUBLIC_API_URL/api/v1).

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER:        '/developers/register',
    LOGIN:           '/developers/login',
    // Dashboard session is cookie-based: refresh + logout rotate/clear the HttpOnly
    // xnt_access / xnt_refresh cookies (no tokens in the body).
    REFRESH:         '/developers/refresh',
    LOGOUT:          '/developers/logout',
    FORGOT_PASSWORD: '/developers/forgot-password',
    RESET_PASSWORD:  '/developers/reset-password',
    VERIFY_EMAIL:    '/developers/verify-email',
    TOKEN:           '/auth/token',
  },
  API_KEYS: {
    BASE:   '/api-keys',
    ROTATE: (id: string) => `/api-keys/${id}/rotate`,
    ONE:    (id: string) => `/api-keys/${id}`,
  },
  ONBOARDING: {
    STATUS:    '/onboarding',
    DEVELOPER: '/onboarding/developer',
    BUSINESS:  '/onboarding/business',
    DOCUMENTS: '/onboarding/documents',
    SUBMIT:    '/onboarding/submit',
  },
  WEBHOOKS: {
    BASE: '/webhook-endpoints',
    ONE:  (id: string) => `/webhook-endpoints/${id}`,
  },
  TEAM: {
    BASE:   '/team',
    ONE:    (id: string) => `/team/${id}`,
    ACCEPT: '/team/accept',
  },
} as const;
