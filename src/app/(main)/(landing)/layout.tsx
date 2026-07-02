import Footer from '@/components/navigation/footer';
import Navbar from '@/components/navigation/navbar';
import React from 'react';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen w-full flex-col justify-between'>
      <Navbar />
      <div className='flex-1 pt-[72px]'>{children}</div>
      <Footer />
    </div>
  );
}
