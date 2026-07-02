import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Xental',
  description: 'Explore all Xental features for automated payment collection and virtual account management.',
};

export default function FeaturesPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Features</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
