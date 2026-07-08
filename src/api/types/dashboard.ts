// API response shapes (matching Swagger schemas)

export type InsightsResponse = {
  virtualAccounts: number;
  deposits: number;
  totalCollectedKobo: number;
  expectedKobo: number;
  outstandingDeficitKobo: number;
  collectionRatePct: number;
  reconciled: number;
  underpaid: number;
  overpaid: number;
  pendingReview: number;
  highRisk: number;
  fullyPaidAccounts: number;
  partiallyPaidAccounts: number;
};

export type SubMerchantResponse = {
  id: string;
  name: string | null;
  reference: string | null;
  status: string | null;
  createdAtUtc: string;
};

export type TransactionResponse = {
  id: string;
  reference: string | null;
  virtualAccountId: string | null;
  amountKobo: number;
  feeKobo: number;
  netCreditKobo: number;
  status: string | null;
  reconciliation: string | null;
  reason: string | null;
  riskScore: number;
  transferName: string | null;
  occurredAtUtc: string;
  reconciledAtUtc: string | null;
};

export type VirtualAccountResponse = {
  id: string;
  accountRef: string | null;
  accountNumber: string | null;
  bankName: string | null;
  accountName: string | null;
  expectedAmountKobo: number | null;
  amountPaidKobo: number;
  deficitKobo: number;
  overpaymentKobo: number;
  status: string | null;
  paymentState: string | null;
  subMerchantId: string | null;
  expiryDateUtc: string | null;
  createdAtUtc: string;
};

export type ApiKeyResponse = {
  id: string;
  clientId: string | null;
  name: string | null;
  label: string | null;
  status: string | null;
  createdAtUtc: string;
  lastUsedAtUtc: string | null;
};

export type WebhookEndpointResponse = {
  id: string;
  url: string | null;
  active: boolean;
  createdAtUtc: string;
};

/** Returned only from POST /webhook-endpoints — the signing secret is shown once. */
export type WebhookEndpointCreatedResponse = {
  id: string;
  url: string;
  signingSecret: string;
};

export type SimulatedDepositResponse = {
  status: string | null;
  reference: string | null;
  reconciliation: string | null;
  paymentState: string | null;
  reason: string | null;
};

export type DeveloperProfileResponse = {
  tenantId: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  status: string | null;
  createdAtUtc: string;
};
