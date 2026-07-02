import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webhooks — Xental',
  description: 'Learn how to receive real-time payment events via Xental webhooks.',
};

export default function WebhooksPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Webhooks</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
