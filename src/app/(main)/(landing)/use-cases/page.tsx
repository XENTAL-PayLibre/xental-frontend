import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use Cases — Xental',
  description: 'See how businesses across industries use Xental to automate payment collection.',
};

export default function UseCasesPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Use Cases</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
