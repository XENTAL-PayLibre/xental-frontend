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
    CHANGE_PASSWORD: '/developers/change-password',
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
    DELIVERIES: '/webhook-endpoints/deliveries',
    REPLAY: (id: string) => `/webhook-endpoints/deliveries/${id}/replay`,
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
    ONE: (accountRef: string) => `/virtual-accounts/${accountRef}`,
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    SUMMARY: '/transactions/summary',
    ONE: (reference: string) => `/transactions/${reference}`,
    REFUND: (reference: string) => `/transactions/${reference}/refund`,
  },
  CHECKOUT: {
    SESSIONS: '/checkout/sessions',
  },
  SETTLEMENT: {
    CONFIG: '/settings/settlement',
    SPLITS: '/settings/splits',
    HOLD: (accountRef: string) => `/settings/splits/${accountRef}/hold`,
    RELEASE: (accountRef: string) => `/settings/splits/${accountRef}/release`,
  },
  BILLING: {
    SCHEDULES: '/billing/schedules',
    ONE: (id: string) => `/billing/schedules/${id}`,
    NEXT_AMOUNT: (id: string) => `/billing/schedules/${id}/next-amount`,
    PAUSE: (id: string) => `/billing/schedules/${id}/pause`,
    RESUME: (id: string) => `/billing/schedules/${id}/resume`,
    CANCEL: (id: string) => `/billing/schedules/${id}/cancel`,
    PERIODS: (id: string) => `/billing/schedules/${id}/periods`,
  },
  TRANSFERS: {
    BASE: '/transfers',
    BANKS: '/transfers/banks',
    LOOKUP: '/transfers/bank/lookup',
    SEND: '/transfers/bank',
    ONE: (merchantTxRef: string) => `/transfers/${merchantTxRef}`,
  },
  RULES: {
    BASE: '/rules',
    ONE: (id: string) => `/rules/${id}`,
  },
  SUB_MERCHANTS: {
    BASE: '/sub-merchants',
    PAYOUT: (id: string) => `/sub-merchants/${id}/payout`,
    BALANCE: (id: string) => `/sub-merchants/${id}/balance`,
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
