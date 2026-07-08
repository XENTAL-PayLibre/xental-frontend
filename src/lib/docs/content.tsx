import type { ReactNode } from 'react';

export interface Quirk {
  variant: 'note' | 'warning' | 'tip';
  title: string;
  body: ReactNode;
}

export interface SectionContent {
  intro?: ReactNode;
  quirks?: Quirk[];
  /** Extra "what it does" note per operation, keyed by `METHOD /path`. */
  notes?: Record<string, ReactNode>;
}

const C = ({ children }: { children: ReactNode }) => <code>{children}</code>;

export const SECTION_CONTENT: Record<string, SectionContent> = {
  'virtual-accounts': {
    intro: (
      <>
        A virtual account is a <strong>persistent NUBAN</strong> mapped to one of your customers. Once created it never
        changes, so a customer can pay into the same account number repeatedly. Every inflow is reconciled against the
        account&apos;s optional <C>expectedAmountKobo</C>.
      </>
    ),
    notes: {
      'POST /api/v1/virtual-accounts':
        'Provisions a NUBAN via the bank provider and stores it under your accountRef. If you pass expectedAmountKobo, inflows are classified as exact / underpaid / overpaid against it; omit it for an open account that simply accrues credit.',
      'GET /api/v1/virtual-accounts/{accountRef}':
        'Returns the account plus its running balance (amountPaidKobo), deficit, overpayment, and paymentState — the fastest way to poll payment progress if you are not using webhooks or Live Checkout.',
    },
    quirks: [
      { variant: 'warning', title: 'Amounts are in kobo, not naira', body: <>Every amount is an integer in <strong>kobo</strong> (₦1 = 100 kobo). <C>expectedAmountKobo: 500000</C> means ₦5,000. Passing naira is the single most common integration bug.</> },
      { variant: 'warning', title: 'accountRef is unique per tenant', body: <>Re-using an existing <C>accountRef</C> returns the existing account rather than creating a duplicate. Use a stable, unique reference per customer (e.g. an invoice or user id).</> },
      { variant: 'note', title: 'Provisioning can briefly fail (502)', body: <>Provisioning depends on the upstream bank provider&apos;s sandbox, which is occasionally flaky. On a <C>502 Upstream provider error</C>, retry with the same <C>accountRef</C> — it is safe and returns the account once it succeeds.</> },
    ],
  },

  transactions: {
    intro: <>Every reconciled inflow is written as an immutable transaction. The list is your ledger — statuses reflect the reconciliation rule book.</>,
    notes: {
      'POST /api/v1/transactions/{reference}/refund': 'Refunds an overpayment surplus back to the payer. Sends only the amount still held for the account (never double-spends against settlement), releases any overpayment hold, and is idempotent per deposit. The destination is pre-filled from the payer’s captured source account, or supply accountNumber + bankCode.',
    },
    quirks: [
      { variant: 'note', title: 'Unknown-account deposits go to review', body: <>A transfer into a NUBAN Xental doesn&apos;t recognise is still recorded (with a null account) and marked <C>PendingReview</C> rather than dropped — check the review queue for these.</> },
      { variant: 'note', title: 'High risk routes to review even when the amount matches', body: <>A deposit that reconciles on amount can still be flagged <C>PendingReview</C> if its risk score crosses the threshold (name mismatch, velocity, payer-name reuse).</> },
      { variant: 'tip', title: 'Overpayments can be refunded', body: <>When a customer overpays (or pays twice), refund the surplus with <C>POST /transactions/{'{'}reference{'}'}/refund</C>. Pair it with an <a href='/documentation/api-reference/money-rules'>Overpaid → Hold</a> rule to park the surplus for review first.</> },
    ],
  },

  transfers: {
    intro: <>Send payouts to any bank account. Always confirm the recipient with a name lookup first.</>,
    notes: {
      'POST /api/v1/transfers/bank/lookup': 'Resolves an account number + bank code to the account holder name. Call this before initiating a transfer to avoid sending to the wrong account.',
      'POST /api/v1/transfers/bank': 'Initiates a payout. Idempotent on your merchantTxRef.',
    },
    quirks: [
      { variant: 'tip', title: 'Idempotent on merchantTxRef', body: <>Re-submitting a transfer with the same <C>merchantTxRef</C> returns the existing transfer instead of paying twice. Generate one stable ref per payout and retry safely.</> },
      { variant: 'warning', title: 'Daily payout cap', body: <>Payouts are subject to a per-tenant daily cap. Transfers over the remaining limit are rejected — batch or schedule large payouts accordingly.</> },
    ],
  },

  'sub-merchants': {
    intro: <>Sub-merchants let you segment your own customers, branches, or tenants inside Xental. They are internal records — not created on any external provider.</>,
    quirks: [{ variant: 'note', title: 'Reference unique per tenant', body: <>Two of <em>your</em> sub-merchants can&apos;t share a <C>reference</C>, but a reference you use is independent of what other Xental accounts use.</> }],
  },

  'webhook-endpoints': {
    intro: <>Register HTTPS endpoints to receive signed, enriched, pre-reconciled events (e.g. <C>deposit.reconciled</C>). Xental signs each delivery and retries with backoff.</>,
    quirks: [
      { variant: 'warning', title: 'Signing secret is shown once', body: <>The endpoint&apos;s signing secret is returned only at creation. Store it immediately — you&apos;ll need it to verify the <C>HMAC-SHA256</C> signature on every delivery.</> },
      { variant: 'warning', title: 'Public HTTPS only (SSRF-guarded)', body: <>Endpoint URLs must be public <C>https</C>. Private/loopback/link-local hosts are rejected. For local dev, use a tunnel (e.g. ngrok).</> },
      { variant: 'tip', title: 'Failed deliveries are replayable', body: <>Deliveries retry with backoff and are dead-lettered after exhaustion — you can list and replay them rather than losing an event.</> },
    ],
  },

  insights: { intro: <>Aggregate analytics for your account: collection rate, outstanding deficit, and a reconciliation + risk breakdown.</> },

  'settlement-settings': {
    intro: <>Configure where collected funds are swept and when. When auto-settle is on and a bank account is set, fully-paid accounts are settled automatically.</>,
    quirks: [
      { variant: 'warning', title: 'Auto-settle needs BOTH account and bank code', body: <>Setting <C>autoSettle: true</C> alone does nothing — the sweep only runs when <C>settlementAccountNumber</C> and <C>settlementBankCode</C> are also present.</> },
      { variant: 'note', title: 'Min payout threshold', body: <>Accounts below <C>minPayoutKobo</C> are held back from settlement until they clear the threshold.</> },
    ],
  },

  'split-settlement': {
    intro: <>Fan a settled account&apos;s net across multiple beneficiaries instead of a single sweep. Legs are percentage (basis points) or flat kobo, paid in priority order.</>,
    quirks: [
      { variant: 'warning', title: 'Percentages are basis points', body: <>1% = <C>100</C> bps; 80% = <C>8000</C>. The first (lowest-priority) leg absorbs any rounding remainder so legs always sum to <strong>exactly</strong> net.</> },
      { variant: 'warning', title: 'Over-allocation aborts the whole settlement', body: <>If flat legs exceed the net collected, the settlement is skipped entirely (never partial) until you fix the plan. Keep flat amounts well under expected net.</> },
      { variant: 'tip', title: 'Empty list = single sweep', body: <>Sending an empty <C>splits</C> array clears the plan and reverts to the default single sweep.</> },
    ],
  },

  escrow: {
    intro: <>Park a virtual account&apos;s funds so the settlement worker won&apos;t sweep them until you release the hold — useful for marketplaces, deliveries, and disputes.</>,
    quirks: [
      { variant: 'note', title: 'One active hold per account', body: <>Calling hold again while a hold is active returns the existing hold rather than stacking. Release before the next sweep can settle.</> },
      { variant: 'warning', title: 'Release before you expect settlement', body: <>An account can be fully paid but will not settle while held. Remember to <C>release</C> once your condition (e.g. delivery) is met.</> },
    ],
  },

  checkout: {
    intro: <>Show a payer real-time status. Create a session token for an account, then stream its reconciliation status over Server-Sent Events — the status flips to paid the instant the deposit reconciles.</>,
    notes: {
      'POST /api/v1/checkout/sessions': 'Mints an opaque, expiring token scoped to one account. Hand the returned streamUrl/snapshotUrl to your payer-facing page.',
      'GET /api/v1/checkout/{token}/stream': 'An SSE stream — connect with EventSource. Emits the current snapshot immediately, then a new event on every status change.',
    },
    quirks: [
      { variant: 'note', title: 'The stream + snapshot are anonymous', body: <>They&apos;re authorised by the opaque token, not your API key, so they&apos;re safe to hit directly from a payer&apos;s browser. They expose only payment state — never PII.</> },
      { variant: 'warning', title: 'Tokens expire', body: <>Default TTL is 1 hour (max 24h via <C>ttlSeconds</C>). An unknown or expired token returns <C>404</C> — mint a fresh session per checkout.</> },
      { variant: 'tip', title: 'Use EventSource', body: <><C>new EventSource(streamUrl)</C> reconnects automatically. Close it on unmount, and fall back to the snapshot endpoint where SSE isn&apos;t available.</> },
    ],
  },

  'money-rules': {
    intro: <>Declarative if-this-then-that on reconciled deposits: e.g. overpaid → hold, high-risk → hold, any → notify. Rules react to the outcome; they never change how a deposit is classified.</>,
    quirks: [
      { variant: 'note', title: 'Evaluated after reconciliation commits', body: <>Rules run post-commit and are fully isolated — a rule can&apos;t corrupt or change the reconciliation verdict. Actions reuse existing primitives (Hold → escrow, Notify → webhook event).</> },
      { variant: 'note', title: 'Thresholds are typed', body: <><C>thresholdKobo</C> gates amount triggers (Overpaid/Underpaid); <C>minRiskScore</C> (0–100) gates <C>HighRisk</C>. A rule only fires when its gate is met.</> },
      { variant: 'note', title: 'Refund an overpayment via Hold → approve', body: <>Rule actions are Hold / Notify / ReviewFlag — there is no auto-refund <em>action</em>. The recommended pattern for duplicate/over payments is <C>Overpaid → Hold</C> (parks the surplus), then approve a refund with <C>POST /transactions/{'{'}reference{'}'}/refund</C> (see <a href='/documentation/api-reference/transactions'>Transactions</a>).</> },
    ],
  },

  sandbox: {
    intro: <>Drive the <strong>real</strong> reconciliation engine with zero money. Simulate a deposit into one of your accounts and watch it reconcile — splits and money rules fire exactly as they would for a live bank transfer.</>,
    quirks: [
      { variant: 'warning', title: 'Test-mode keys only', body: <>The simulator rejects live keys with <C>403</C>. Use a test key against the sandbox base URL. This keeps the &quot;zero real money&quot; guarantee.</> },
      { variant: 'note', title: 'Each call is a new deposit', body: <>Every simulate is a fresh inflow, so amounts <em>accumulate</em>. Simulate ₦1,000 then ₦500 into a ₦1,000-expected account and it goes <C>FullyPaid</C> → <C>Overpaid</C>. It is not idempotent by design.</> },
      { variant: 'tip', title: 'Same code path as production', body: <>The simulator calls the identical reconciliation routine a live webhook uses, so a green sandbox run is real proof your integration works.</> },
    ],
  },

  billing: {
    intro: <>Bill a customer on a recurring cycle from a reusable virtual account. Each cycle Xental opens a <strong>period</strong> for the (variable) expected amount, attributes the customer&apos;s deposits to open periods oldest-first, reminds them when due/overdue, and emits <C>billing.period.due/paid/overdue</C> events. It never pulls funds — the customer pays into their account; Xental attributes and reminds.</>,
    notes: {
      'POST /api/v1/billing/schedules': 'Creates a schedule on one of your reusable virtual accounts and opens the first period. Interval is Weekly | Monthly | Quarterly | Yearly.',
      'PUT /api/v1/billing/schedules/{id}/next-amount': 'Sets the expected amount for the next cycle — billing is variable, so each period can differ.',
    },
    quirks: [
      { variant: 'warning', title: 'Amounts are in kobo', body: <><C>amountKobo: 50000</C> is ₦500. The per-period expected amount is set at creation and can be changed per cycle via <C>next-amount</C>.</> },
      { variant: 'note', title: 'Overpayment carries forward', body: <>Paying more than a period&apos;s amount settles it and carries the surplus to the next period. To return a surplus instead, refund it (see <a href='/documentation/api-reference/transactions'>Transactions</a>).</> },
      { variant: 'tip', title: 'One active schedule per account', body: <>A reusable account can have a single active schedule. Pause, resume, or cancel it as the subscription changes.</> },
    ],
  },

  'agent-discovery': {
    intro: <>A compact, machine-readable capability map at <C>/.well-known/llms.txt</C> so a developer can point an AI agent at Xental and have it wire the integration. The full contract remains the OpenAPI document.</>,
  },

  health: {
    intro: <><C>/health</C> is liveness (always 200 if the process is up). <C>/ready</C> is readiness (200 only when the database is reachable) — use it for load-balancer health checks.</>,
  },
};

export const getSectionContent = (slug: string): SectionContent => SECTION_CONTENT[slug] ?? {};
