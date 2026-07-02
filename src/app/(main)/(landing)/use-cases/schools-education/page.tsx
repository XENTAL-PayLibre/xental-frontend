import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schools & Education — Xental',
  description: 'How Xental streamlines school fee collection and education payment management.',
};

export default function SchoolsEducationPage() {
  return (
    <main className='container py-20'>
      <h1 className='text-4xl font-bold text-foreground'>Schools &amp; Education</h1>
      <p className='mt-4 text-muted-foreground'>Coming soon.</p>
    </main>
  );
}
