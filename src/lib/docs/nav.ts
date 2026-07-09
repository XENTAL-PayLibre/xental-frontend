/** Tag metadata for the API reference — maps OpenAPI tags to public doc sections. */
export interface TagMeta {
  tag: string;      // OpenAPI tag
  slug: string;     // /docs/api-reference/{slug}
  title: string;    // display title
  group: string;    // sidebar group heading
  summary: string;  // one-line intro shown on the section page
}

/** Ordered, grouped — admin tags are intentionally absent. */
export const API_TAGS: TagMeta[] = [
  // Core payments
  { tag: 'VirtualAccounts', slug: 'virtual-accounts', title: 'Virtual Accounts', group: 'Core', summary: 'Provision persistent NUBANs (dedicated virtual accounts) for your customers.' },
  { tag: 'Transactions', slug: 'transactions', title: 'Transactions', group: 'Core', summary: 'Reconciled inflows and their statuses.' },
  { tag: 'Transfers', slug: 'transfers', title: 'Transfers', group: 'Core', summary: 'Idempotent bank payouts and account-name lookups.' },
  { tag: 'SubMerchants', slug: 'sub-merchants', title: 'Sub-merchants', group: 'Core', summary: 'Segment your own customers, branches, or tenants.' },
  { tag: 'Billing', slug: 'billing', title: 'Recurring Billing', group: 'Core', summary: 'Per-cycle billing schedules on a reusable account; deposits are attributed to periods and payers are reminded.' },

  // Reconciliation & webhooks
  { tag: 'Webhooks', slug: 'webhooks', title: 'Inbound Webhooks', group: 'Reconciliation', summary: 'The Nomba receiver that drives reconciliation.' },
  { tag: 'WebhookEndpoints', slug: 'webhook-endpoints', title: 'Webhook Endpoints', group: 'Reconciliation', summary: 'Register endpoints to receive signed, enriched events.' },
  { tag: 'Insights', slug: 'insights', title: 'Insights', group: 'Reconciliation', summary: 'Collection rate & risk breakdown, plus Collections Intelligence: receivables aging, a cash-flow forecast, and per-customer collection scores.' },

  // Settlement
  { tag: 'Settings', slug: 'settlement-settings', title: 'Settlement Settings', group: 'Settlement', summary: 'Your settlement bank account and auto-settle threshold.' },
  { tag: 'SettlementSplits', slug: 'split-settlement', title: 'Split Settlement', group: 'Settlement', summary: 'Fan a settled account across multiple beneficiaries.' },
  { tag: 'Settlements', slug: 'escrow', title: 'Escrow', group: 'Settlement', summary: 'Hold and release an account’s funds before settlement.' },

  // Real-time & automation
  { tag: 'Checkout', slug: 'checkout', title: 'Live Checkout', group: 'Real-time & automation', summary: 'Real-time “Payment received” via a session token + SSE stream.' },
  { tag: 'Rules', slug: 'money-rules', title: 'Money Rules', group: 'Real-time & automation', summary: 'Declarative if-this-then-that on reconciled deposits.' },
  { tag: 'Flows', slug: 'payment-flows', title: 'Payment Flows', group: 'Real-time & automation', summary: 'Multi-step automation on reconciled deposits: a trigger + conditions run an ordered list of actions (hold / release / notify / flag), with an audit trail.' },
  { tag: 'Sandbox', slug: 'sandbox', title: 'Sandbox Simulator', group: 'Real-time & automation', summary: 'Drive a real reconciliation with zero money (test-mode).' },

  // Auth (integration only): exchange a key you already have for a bearer token.
  { tag: 'Auth', slug: 'tokens', title: 'API Tokens', group: 'Authentication', summary: 'Exchange your API key for a bearer token.' },

  // AI & agents
  { tag: 'Copilot', slug: 'copilot', title: 'Copilot', group: 'AI & agents', summary: 'A grounded, natural-language assistant that answers questions about your account from live data.' },
  { tag: 'AgentDiscovery', slug: 'agent-discovery', title: 'Agent Discovery', group: 'AI & agents', summary: 'Machine-readable capability map (llms.txt) for AI agents.' },
];

/** Static guide pages that live alongside the API reference, merged into a group in the sidebar. */
const GUIDE_EXTRAS: Record<string, NavItem[]> = {
  'AI & agents': [{ title: 'MCP Server', href: '/documentation/mcp' }],
};

export const tagBySlug = (slug: string) => API_TAGS.find((t) => t.slug === slug);

export interface NavItem { title: string; href: string; }
export interface NavGroup { title: string; items: NavItem[]; }

/** Full sidebar: static guides + the grouped API reference. */
export function getDocsNav(): NavGroup[] {
  const groups: NavGroup[] = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Overview', href: '/documentation' },
        { title: 'Quickstart', href: '/documentation/quickstart' },
        { title: 'Authentication', href: '/documentation/authentication' },
      ],
    },
  ];

  const order = ['Core', 'Reconciliation', 'Settlement', 'Real-time & automation', 'Authentication', 'AI & agents'];
  for (const group of order) {
    const items: NavItem[] = [
      ...(GUIDE_EXTRAS[group] ?? []),
      ...API_TAGS.filter((t) => t.group === group).map((t) => ({ title: t.title, href: `/documentation/api-reference/${t.slug}` })),
    ];
    if (items.length) groups.push({ title: group, items });
  }
  return groups;
}
