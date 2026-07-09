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

export type AgingBucketResponse = {
  label: string;
  accounts: number;
  outstandingKobo: number;
};
export type AgingReportResponse = {
  totalOutstandingKobo: number;
  buckets: AgingBucketResponse[];
};

export type ForecastWeekResponse = {
  weekStartUtc: string;
  scheduledKobo: number;
};
export type CashFlowForecastResponse = {
  days: number;
  scheduledDueKobo: number;
  dailyRunRateKobo: number;
  runRateProjectedKobo: number;
  projectedTotalKobo: number;
  weeks: ForecastWeekResponse[];
};

export type CustomerScoreResponse = {
  customerRef: string;
  customerName: string;
  expectedKobo: number;
  paidKobo: number;
  outstandingKobo: number;
  collectionRatePct: number;
  deposits: number;
  duePeriods: number;
  latePeriods: number;
  score: number;
  rating: string;
};

export type CopilotAction = { label: string; href: string };
export type CopilotAnswer = {
  intent: string;
  reply: string;
  suggestions: string[];
  actions: CopilotAction[];
  data?: unknown;
};

export type TransactionSummaryResponse = {
  total: number;
  totalPayinsKobo: number;
  successful: number;
  failed: number;
  pendingReview: number;
  successfulKobo: number;
  netCreditedKobo: number;
};

export type SubMerchantResponse = {
  id: string;
  name: string | null;
  reference: string | null;
  status: string | null;
  hasPayoutAccount?: boolean;
  settlementBankName?: string | null;
  settlementBankCode?: string | null;
  settlementAccountNumber?: string | null;
  settlementAccountName?: string | null;
  platformFeeBps?: number;
  createdAtUtc: string;
};

export type SubMerchantBalanceResponse = {
  subMerchantId: string;
  reference: string;
  collectedKobo: number;
  settledKobo: number;
  pendingKobo: number;
  virtualAccounts: number;
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
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
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
  /** Present only in the create/rotate response — shown once. */
  clientSecret?: string | null;
  mode?: string | null;
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

// ---- Refunds ----
export type RefundResponse = {
  status: string;
  transferRef: string;
  amountKobo: number;
  destinationAccountNumber: string;
  destinationBankCode: string;
  providerReference: string | null;
};

// ---- Live Checkout / payment links ----
export type CheckoutSnapshotResponse = {
  accountRef: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  brand: string;
  paymentState: string;
  amountPaidKobo: number;
  expectedAmountKobo: number | null;
};

export type CheckoutSessionResponse = {
  token: string;
  snapshotUrl: string;
  streamUrl: string;
  expiresAtUtc: string;
  snapshot: CheckoutSnapshotResponse;
};

// ---- Escrow / settlement hold ----
export type EscrowHoldResponse = {
  id: string;
  accountRef: string;
  amountKobo: number;
  state: string;
  releaseCondition: string | null;
  createdAtUtc: string;
};

export type SplitLegResponse = {
  id: string;
  beneficiaryName: string;
  accountNumber: string;
  bankCode: string;
  basis: string; // "Percentage" | "Flat"
  shareBps: number;
  flatKobo: number;
  priority: number;
  enabled: boolean;
};

export type SplitLegInput = {
  beneficiaryName: string;
  accountNumber: string;
  bankCode: string;
  basis: string;
  shareBps: number;
  flatKobo: number;
  priority: number;
};

export type SettlementConfigResponse = {
  settlementAccountNumber: string | null;
  settlementBankCode: string | null;
  settlementAccountName: string | null;
  autoSettle: boolean;
  minPayoutKobo: number;
  canAutoSettle: boolean;
};

// ---- Transfers / payouts ----
export type BankLookupResponse = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
};

export type BankResponse = {
  name: string;
  code: string;
};

export type TransferResponse = {
  id: string;
  merchantTxRef: string;
  amountKobo: number;
  recipientAccountNumber: string;
  recipientBankCode: string;
  status: string;
  providerReference: string | null;
  failureReason: string | null;
  createdAtUtc: string;
  completedAtUtc: string | null;
};

// ---- Recurring billing ----
export type BillingScheduleResponse = {
  id: string;
  reference: string;
  accountRef: string;
  interval: string;
  status: string;
  nextAmountKobo: number;
  dueOffsetDays: number;
  periodsGenerated: number;
  carryCreditKobo: number;
  currentPeriodEndUtc: string | null;
  description: string | null;
  createdAtUtc: string;
};

export type BillingPeriodResponse = {
  id: string;
  sequence: number;
  status: string;
  expectedAmountKobo: number;
  amountAttributedKobo: number;
  outstandingKobo: number;
  periodStartUtc: string;
  periodEndUtc: string;
  dueDateUtc: string;
  paidAtUtc: string | null;
};

// ---- Webhook deliveries ----
export type WebhookDeliveryResponse = {
  id: string;
  endpointId: string;
  eventType: string;
  status: string;
  attempts: number;
  nextAttemptAtUtc: string | null;
  deliveredAtUtc: string | null;
  lastStatusCode: number | null;
  lastError: string | null;
  createdAtUtc: string;
};

// ---- Money rules ----
export type RuleResponse = {
  id: string;
  trigger: string;
  action: string;
  thresholdKobo: number | null;
  minRiskScore: number | null;
  enabled: boolean;
  priority: number;
};

export type FlowResponse = {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  minAmountKobo: number | null;
  minRiskScore: number | null;
  enabled: boolean;
  priority: number;
  createdAtUtc: string;
};

export type FlowRunResponse = {
  id: string;
  flowId: string;
  flowName: string;
  trigger: string;
  accountRef: string | null;
  transactionRef: string | null;
  outcome: string;
  createdAtUtc: string;
};
