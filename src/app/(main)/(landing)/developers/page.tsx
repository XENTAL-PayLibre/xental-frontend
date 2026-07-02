import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developers — Xental',
  description: 'Everything you need to integrate Xental into your product with our developer-first APIs.',
};

export default function DevelopersPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Developers</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
