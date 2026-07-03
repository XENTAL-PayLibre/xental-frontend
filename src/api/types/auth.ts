// ── Auth payload & response types ──────────────────────────────────────────

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

/**
 * 201 response from POST /api/v1/developers/register.
 * Does NOT contain auth tokens — user must verify email before logging in.
 */
export type RegisterResponse = {
  tenantId: string;
  email: string;
  emailVerified: boolean;
  message: string;
};


export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  tenantId: string;
  email: string;
  emailVerified: boolean;
};
