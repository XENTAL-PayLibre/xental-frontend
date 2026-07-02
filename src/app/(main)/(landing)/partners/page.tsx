import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partners — Xental',
  description: 'Partner with Xental to deliver automated payment infrastructure to your clients.',
};

export default function PartnersPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Partners</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
