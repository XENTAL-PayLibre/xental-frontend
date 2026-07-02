import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Reference — Xental',
  description: 'Full API reference for the Xental payment and virtual account APIs.',
};

export default function ApiReferencePage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>API Reference</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
