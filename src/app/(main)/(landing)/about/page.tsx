import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Xental',
  description: 'Learn about Xental, our mission, and the team building the future of payment infrastructure.',
};

export default function AboutPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>About</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
