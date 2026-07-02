import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Xental',
  description: 'Get in touch with the Xental team for sales, support, or partnership enquiries.',
};

export default function ContactPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Contact</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
