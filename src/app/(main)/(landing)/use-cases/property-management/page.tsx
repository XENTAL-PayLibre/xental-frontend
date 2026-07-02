import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Management — Xental',
  description: 'How Xental automates rent collection and payment reconciliation for property managers.',
};

export default function PropertyManagementPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Property Management</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
