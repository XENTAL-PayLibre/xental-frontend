import type { Metadata } from 'next';
import { Prose } from '@/components/docs/Prose';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DOCS_API_BASE } from '@/lib/docs/openapi';

export const metadata: Metadata = {
  title: 'Quickstart — Xental API',
  description: 'Go from signup to a reconciled payment in a few calls.',
};

export default function QuickstartPage() {
  return (
    <Prose>
      <h1>Quickstart</h1>
      <p>
        This guide takes you from an API key to a fully reconciled payment. Everything here works with a{' '}
        <strong>test-mode</strong> key (zero real money). Create your key in the Xental dashboard; a live key becomes
        available once your account is approved there.
      </p>

      <h2>1. Get a bearer token</h2>
      <p>Create an API key in the dashboard, then exchange its client id + secret for a short-lived bearer token.</p>
      <CodeBlock
        language='cURL'
        code={`curl -X POST "${DOCS_API_BASE}/api/v1/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{ "clientId": "xnt_test_...", "clientSecret": "sk_test_..." }'`}
      />

      <h2>2. Provision a virtual account</h2>
      <p>Create a persistent NUBAN for a customer, optionally with an expected amount (in kobo).</p>
      <CodeBlock
        language='cURL'
        code={`curl -X POST "${DOCS_API_BASE}/api/v1/virtual-accounts" \\
  -H "Authorization: Bearer <API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{ "accountRef": "inv_001", "name": "Ada Lovelace", "expectedAmountKobo": 500000 }'`}
      />

      <h2>3. Simulate a payment (test mode)</h2>
      <p>
        Rather than making a real bank transfer, drive the <strong>real reconciliation engine</strong> with the sandbox
        simulator — zero money, same code path as a live webhook.
      </p>
      <CodeBlock
        language='cURL'
        code={`curl -X POST "${DOCS_API_BASE}/api/v1/sandbox/simulate/deposit" \\
  -H "Authorization: Bearer <API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{ "accountRef": "inv_001", "amountKobo": 500000 }'`}
      />
      <p>
        The response reports <code>reconciliation</code> and <code>paymentState</code> (e.g. <code>FullyPaid</code>). Fetch
        the account any time to see its balance:
      </p>
      <CodeBlock
        language='cURL'
        code={`curl "${DOCS_API_BASE}/api/v1/virtual-accounts/inv_001" \\
  -H "Authorization: Bearer <API_TOKEN>"`}
      />

      <h2>4. Receive events</h2>
      <p>
        Register a <a href='/documentation/api-reference/webhook-endpoints'>webhook endpoint</a> to receive signed, pre-reconciled
        <code>deposit.reconciled</code> events, or open a <a href='/documentation/api-reference/checkout'>Live Checkout</a> stream to
        show a payer “Payment received ✓” in real time.
      </p>

      <h2>Next steps</h2>
      <ul>
        <li><a href='/documentation/authentication'>Authentication</a> — keys, tokens, and the two auth planes.</li>
        <li><a href='/documentation/api-reference/split-settlement'>Split & Escrow</a> — fan settlements across beneficiaries.</li>
        <li><a href='/documentation/api-reference/money-rules'>Money Rules</a> — automate holds and notifications.</li>
      </ul>
    </Prose>
  );
}
