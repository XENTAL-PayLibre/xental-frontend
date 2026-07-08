import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Repeat, Wallet, Radio, GitBranch, Sparkles, Webhook } from 'lucide-react';
import { Prose } from '@/components/docs/Prose';
import { DOCS_API_BASE, DOCS_SANDBOX_BASE } from '@/lib/docs/openapi';

export const metadata: Metadata = {
  title: 'Documentation — Xental',
  description: 'Build on Xental: dedicated virtual accounts, automatic reconciliation, settlement, and real-time payment events.',
};

const CARDS = [
  { icon: Wallet, title: 'Virtual Accounts', href: '/documentation/api-reference/virtual-accounts', desc: 'Provision persistent NUBANs and reconcile inflows automatically.' },
  { icon: Repeat, title: 'Recurring Billing', href: '/documentation/api-reference/billing', desc: 'Per-cycle billing on a reusable account, with automatic attribution.' },
  { icon: Webhook, title: 'Webhook Endpoints', href: '/documentation/api-reference/webhook-endpoints', desc: 'Receive signed, enriched, pre-reconciled events.' },
  { icon: Radio, title: 'Live Checkout', href: '/documentation/api-reference/checkout', desc: 'Real-time “Payment received” over a Server-Sent Events stream.' },
  { icon: GitBranch, title: 'Split & Escrow', href: '/documentation/api-reference/split-settlement', desc: 'Fan settlements across beneficiaries; hold funds in escrow.' },
  { icon: Sparkles, title: 'Sandbox Simulator', href: '/documentation/api-reference/sandbox', desc: 'Test the full reconciliation flow with zero money.' },
];

export default function DocsOverviewPage() {
  return (
    <div>
      <Prose>
        <h1>Xental API</h1>
        <p>
          Xental gives any platform <strong>reusable dedicated virtual accounts (NUBANs)</strong> with{' '}
          <strong>automatic reconciliation</strong>. Issue a persistent bank account number per customer, and Xental
          reconciles inbound transfers against expected amounts — handling underpayment, overpayment, duplicates, and
          reversals — then pushes clean, pre-reconciled events to your app.
        </p>
      </Prose>

      <div className='mt-6 rounded-xl border border-border bg-card p-5'>
        <div className='flex items-center justify-between'>
          <p className='text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>Base URLs</p>
          <Link
            href='/documentation/quickstart'
            className='inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
          >
            Quickstart <ArrowRight className='size-4' />
          </Link>
        </div>
        <dl className='mt-3 grid gap-2 sm:grid-cols-2'>
          <div className='rounded-lg border border-border p-3'>
            <dt className='text-xs font-medium text-xental-text-primary-400'>Live</dt>
            <dd className='mt-0.5 font-mono text-sm text-foreground'>{DOCS_API_BASE}</dd>
          </div>
          <div className='rounded-lg border border-border p-3'>
            <dt className='text-xs font-medium text-xental-text-primary-400'>Sandbox (test-mode)</dt>
            <dd className='mt-0.5 font-mono text-sm text-foreground'>{DOCS_SANDBOX_BASE}</dd>
          </div>
        </dl>
        <p className='mt-3 text-sm text-xental-text-primary-500'>
          Use the <strong>Sandbox</strong> base with a test-mode key to build and verify with zero money. Switch the code
          samples between environments with the Live / Sandbox toggle.
        </p>
      </div>

      <div className='mt-10 grid gap-4 sm:grid-cols-2'>
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className='group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40'
          >
            <div className='flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground'>
              <c.icon className='size-[18px]' />
            </div>
            <h3 className='mt-3 font-semibold text-foreground group-hover:text-primary'>{c.title}</h3>
            <p className='mt-1 text-sm leading-6 text-xental-text-primary-500'>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
