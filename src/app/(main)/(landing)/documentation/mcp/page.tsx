import type { Metadata } from 'next';
import { Prose } from '@/components/docs/Prose';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DOCS_API_BASE } from '@/lib/docs/openapi';

export const metadata: Metadata = {
  title: 'MCP Server — Xental',
  description: 'Let any MCP-capable AI agent operate your Xental account through typed tools.',
};

export default function McpPage() {
  return (
    <Prose>
      <h1>MCP Server</h1>
      <p>
        The Xental <strong>MCP server</strong> lets any{' '}
        <a href='https://modelcontextprotocol.io' target='_blank' rel='noreferrer'>Model Context Protocol</a>-capable
        agent (Claude Desktop, Claude Code, and others) operate a Xental account through typed tools — provision virtual
        accounts, watch reconciled transactions, run payouts, and drive the sandbox, all in natural language. Instead of an
        agent scraping the dashboard, it talks to Xental over the same public API you use.
      </p>

      <h2>Tools</h2>
      <ul>
        <li><code>get_agent_guide</code> — read the orientation doc (llms.txt): auth, core flow, differentiators.</li>
        <li><code>list_virtual_accounts</code> / <code>get_virtual_account</code> — list or fetch NUBANs with balance + reconciliation state.</li>
        <li><code>create_virtual_account</code> — provision a NUBAN for a customer (a sandbox account on test-mode keys).</li>
        <li><code>delete_virtual_account</code> — remove an account with no activity.</li>
        <li><code>list_transactions</code> / <code>get_transaction</code> / <code>transactions_summary</code> — reconciled inflows/outflows and totals.</li>
        <li><code>list_banks</code> / <code>lookup_bank_account</code> — payout bank list and account-name enquiry.</li>
        <li><code>initiate_transfer</code> / <code>list_transfers</code> — send a payout (idempotent) or list payouts.</li>
        <li><code>simulate_deposit</code> — sandbox only: drive a real reconciliation with no bank movement.</li>
      </ul>
      <p>All money is integer <strong>kobo</strong> (₦1 = 100 kobo). Money-moving calls are idempotent on a caller-supplied reference.</p>

      <h2>Install</h2>
      <p>The server lives in the Xental repo under <code>clients/xental-mcp</code>. Build it once:</p>
      <CodeBlock
        language='bash'
        code={`cd clients/xental-mcp
npm install
npm run build`}
      />

      <h2>Configure</h2>
      <p>
        You need an API key from the dashboard (<strong>Settings → Developers</strong>) — copy the client id and client
        secret (the secret is shown once). Start with a <strong>test-mode</strong> key: it works immediately and moves zero
        real money.
      </p>
      <p>Add the server to your agent. For Claude Desktop, edit <code>claude_desktop_config.json</code>:</p>
      <CodeBlock
        language='json'
        code={`{
  "mcpServers": {
    "xental": {
      "command": "node",
      "args": ["/absolute/path/to/clients/xental-mcp/build/index.js"],
      "env": {
        "XENTAL_API_BASE": "${DOCS_API_BASE}",
        "XENTAL_CLIENT_ID": "your-client-id",
        "XENTAL_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}`}
      />
      <p>
        Restart your agent, then try: <em>&quot;Create a test virtual account for Ada, simulate a ₦5,000 deposit, and show
        me the reconciliation.&quot;</em>
      </p>

      <h2>Auth</h2>
      <p>
        The server exchanges your client credentials at <code>POST /api/v1/auth/token</code> for a short-lived bearer
        token, caches it, and refreshes automatically on expiry or a <code>401</code>. Your secret never leaves the machine
        the server runs on.
      </p>

      <h2>Related</h2>
      <ul>
        <li><a href='/documentation/api-reference/agent-discovery'>Agent Discovery</a> — the machine-readable llms.txt the server reads.</li>
        <li><a href='/documentation/api-reference/copilot'>Copilot</a> — the in-dashboard assistant for humans.</li>
        <li><a href='/documentation/api-reference/sandbox'>Sandbox Simulator</a> — drive reconciliation with zero money.</li>
      </ul>
    </Prose>
  );
}
