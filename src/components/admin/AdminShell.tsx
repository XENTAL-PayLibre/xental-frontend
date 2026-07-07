'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden bg-xental-bg'>
      {/* Desktop sidebar */}
      <div className='hidden lg:block'>
        <AdminSidebar />
      </div>

      {/* Mobile off-canvas drawer */}
      {open && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='absolute inset-0 bg-black/40' onClick={() => setOpen(false)} />
          <div className='absolute left-0 top-0 h-full shadow-xl'>
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Mobile top bar */}
        <header className='flex items-center gap-3 border-b border-stroke-2 bg-white px-4 py-3 lg:hidden'>
          <button
            onClick={() => setOpen(true)}
            aria-label='Open menu'
            className='rounded-lg p-1.5 text-xental-text-primary-500 hover:bg-xental-bg'
          >
            <Menu className='h-5 w-5' />
          </button>
          <Image src='/images/full-logo.svg' alt='Xental' width={96} height={28} className='object-contain' />
        </header>

        <main className='flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6'>
          {/* Removed OnboardingBanner for admin */}
          {children}
        </main>
      </div>
    </div>
  );
}
