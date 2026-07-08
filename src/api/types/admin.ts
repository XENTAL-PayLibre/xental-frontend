export interface AdminLoginRequest {
  email?: string | null;
  password?: string | null;
  totpCode?: string | null;
}

export interface AdminLoginResponse {
  accessToken?: string | null;
  tokenType?: string | null;
  expiresIn?: number;
  email?: string | null;
  role?: string | null;
}

export interface CreateAdminRequest {
  email?: string;
  password?: string;
  role?: string;
}

export interface EnrollMfaResponse {
  otpAuthUri?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export interface ReviewActionRequest {
  track?: string | null;
  reason?: string | null;
}

// Additional types for onboarding queues can be added as needed based on the response format
export interface AdminOnboardingApplication {
  tenantId: string;
  tenantEmail: string;
  tier: string;
  developerKycStatus: string;
  businessKybStatus: string;
  submittedAtUtc: string | null;
}

export interface AdminTenantDetailsResponse {
  summary: AdminOnboardingApplication;
  checks: {
    kind: string;
    outcome: string;
    provider: string;
    detail: string;
    checkedAtUtc: string;
  }[];
  documents: {
    type: string;
    reviewStatus: string;
    downloadUrl: string;
  }[];
}

export interface ReconciliationSummary {
  review: number;
  unknown: number;
  overpaid: number;
  underpaid: number;
  highRisk: number;
  reversals: number;
}

export interface ReconciliationTransaction {
  id: string;
  tenantId: string;
  virtualAccountId: string;
  reference: string;
  amountKobo: number;
  netCreditKobo: number;
  status: string;
  reconciliation: string;
  reason: string;
  riskScore: number;
  transferName: string;
  occurredAtUtc: string;
}

export interface FailedSettlement {
  virtualAccountId: string;
  tenantId: string;
  accountRef: string;
  netKobo: number;
  failureReason: string;
  failedAtUtc: string;
}
