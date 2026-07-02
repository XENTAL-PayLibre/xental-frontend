import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions — Xental',
  description: 'Discover Xental payment solutions built for modern businesses.',
};

export default function SolutionsPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Solutions</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
