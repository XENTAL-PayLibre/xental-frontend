import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Platform — Xental',
  description: 'Build on top of the Xental API to automate payment collection at scale.',
};

export default function ApiProductPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>API Platform</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
