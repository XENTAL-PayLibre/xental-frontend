import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Savings & Investments — Xental',
  description: 'How Xental powers automated payment collection for savings and investment platforms.',
};

export default function SavingsInvestmentsPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Savings &amp; Investments</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
