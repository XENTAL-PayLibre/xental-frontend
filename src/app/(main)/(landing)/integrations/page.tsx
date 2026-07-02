import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations — Xental',
  description: 'Connect Xental with your existing tools, ERPs, and payment infrastructure.',
};

export default function IntegrationsPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Integrations</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
