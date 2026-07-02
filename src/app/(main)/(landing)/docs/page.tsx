import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — Xental',
  description: 'Comprehensive documentation for the Xental payment API and SDKs.',
};

export default function DocsPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Documentation</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
