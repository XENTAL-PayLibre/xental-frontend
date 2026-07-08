// Xental API paths (relative to NEXT_PUBLIC_API_URL/api/v1).

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/developers/register',
    LOGIN: '/developers/login',
    // Step 2 of login: verify the emailed one-time code, which sets the session cookies.
    LOGIN_VERIFY: '/developers/login/verify',
    // Dashboard session is cookie-based: refresh + logout rotate/clear the HttpOnly
    // xnt_access / xnt_refresh cookies (no tokens in the body).
    REFRESH: '/developers/refresh',
    LOGOUT: '/developers/logout',
    FORGOT_PASSWORD: '/developers/forgot-password',
    RESET_PASSWORD: '/developers/reset-password',
    VERIFY_EMAIL: '/developers/verify-email',
    TOKEN: '/auth/token',
  },
  API_KEYS: {
    BASE: '/api-keys',
    ROTATE: (id: string) => `/api-keys/${id}/rotate`,
    ONE: (id: string) => `/api-keys/${id}`,
  },
  ONBOARDING: {
    STATUS: '/onboarding',
    DEVELOPER: '/onboarding/developer',
    BUSINESS: '/onboarding/business',
    DOCUMENTS: '/onboarding/documents',
    SUBMIT: '/onboarding/submit',
  },
  WEBHOOKS: {
    BASE: '/webhook-endpoints',
    ONE: (id: string) => `/webhook-endpoints/${id}`,
  },
  TEAM: {
    BASE: '/team',
    ONE: (id: string) => `/team/${id}`,
    RESEND: (id: string) => `/team/${id}/resend`,
    ACCEPT: '/team/accept',
  },
  VIRTUAL_ACCOUNTS: {
    CREATE: '/virtual-accounts',
    LIST: '/virtual-accounts',
  },
  ACCOUNT_INSIGHTS: {
    BASE: '/insights',
  },
  ADMIN: {
    LOGIN: '/admin/auth/login',
    LOGIN_VERIFY: '/admin/auth/login/verify',
    ONBOARDING: '/admin/onboarding',
    ONBOARDING_DETAIL: (tenantId: string) => `/admin/onboarding/${tenantId}`,
    APPROVE: (tenantId: string) => `/admin/onboarding/${tenantId}/approve`,
    REJECT: (tenantId: string) => `/admin/onboarding/${tenantId}/reject`,
    REQUEST_INFO: (tenantId: string) => `/admin/onboarding/${tenantId}/request-info`,
    RECONCILIATION_SUMMARY: '/admin/reconciliation/summary',
    RECONCILIATION_BUCKET: '/admin/reconciliation',
    SETTLEMENTS_FAILED: '/admin/reconciliation/settlements/failed',
    RETRY_SETTLEMENT: (virtualAccountId: string) => `/admin/reconciliation/settlements/${virtualAccountId}/retry`,
    CREATE_ADMIN: '/admin/admins',
    LIST_ADMINS: '/admin/admins',
    ENROLL_MFA: '/admin/mfa/enroll',
  },
} as const;
