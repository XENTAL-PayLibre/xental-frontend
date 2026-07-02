import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — Xental',
  description: 'Join the Xental team and help build the future of payment infrastructure in Africa.',
};

export default function CareersPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Careers</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
