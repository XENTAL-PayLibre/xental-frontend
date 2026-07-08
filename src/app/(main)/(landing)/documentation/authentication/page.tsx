import type { Metadata } from 'next';
import { Prose } from '@/components/docs/Prose';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DOCS_API_BASE } from '@/lib/docs/openapi';

export const metadata: Metadata = {
  title: 'Authentication — Xental API',
  description: 'Authenticate API requests with a bearer token minted from your API key.',
};

export default function AuthenticationPage() {
  return (
    <Prose>
      <h1>Authentication</h1>
      <p>
        Every API request is authenticated with a <strong>bearer token</strong>. You mint that token from an API key, then
        send it as an <code>Authorization</code> header on each call.
      </p>

      <h2>1. Get your API key</h2>
      <p>
        Create and manage API keys in your <strong>Xental dashboard</strong>. Each key has a <code>test</code> or{' '}
        <code>live</code> mode and a client id + secret — the <strong>secret is shown once</strong>, so copy it immediately.
        (Account signup, onboarding, and key management all happen in the dashboard, not through the API.)
      </p>

      <h2>2. Exchange the key for a bearer token</h2>
      <p>Trade the client id + secret for a short-lived bearer token (valid ~1 hour).</p>
      <CodeBlock
        language='cURL'
        code={`curl -X POST "${DOCS_API_BASE}/api/v1/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{ "clientId": "xnt_test_...", "clientSecret": "sk_test_..." }'`}
      />

      <h2>3. Call the API with the token</h2>
      <p>Send the token as a bearer header on every request. Re-request a token when it expires.</p>
      <CodeBlock
        language='cURL'
        code={`curl "${DOCS_API_BASE}/api/v1/virtual-accounts/inv_001" \\
  -H "Authorization: Bearer <API_TOKEN>"`}
      />

      <h2>Test vs live</h2>
      <p>
        A key&apos;s mode travels inside every token minted from it, so calls always run against the matching environment. A{' '}
        <code>test</code> key works immediately and moves no real money — build and verify against it with the{' '}
        <a href='/documentation/api-reference/sandbox'>sandbox simulator</a>. A <code>live</code> key becomes available once your
        account is approved in the dashboard.
      </p>

      <h2>Errors</h2>
      <p>
        All errors are JSON problem details with a stable <code>status</code> and message: <code>401</code> unauthenticated
        (missing/expired token), <code>403</code> wrong plane or a live key on a sandbox-only tool, <code>404</code> not
        found, <code>409</code> conflict.
      </p>
    </Prose>
  );
}
