export type ApiKeyMode = 'Test' | 'Live';
export type ApiKeyStatus = 'Active' | 'Revoked';

/** Mirrors the backend ApiKeyResponse. `clientSecret` is present ONLY at create/rotate. */
export interface ApiKey {
  id: string;
  clientId: string;
  clientSecret: string | null;
  mode: ApiKeyMode;
  label: string;
  status: ApiKeyStatus;
  lastUsedAtUtc: string | null;
  createdAtUtc: string;
}

export interface CreateApiKeyPayload {
  label: string;
  mode: 'test' | 'live';
}
