import React from 'react';
import Image from 'next/image';

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    /**
     * CSS Grid: two columns — [42% | 1fr].
     * Grid rows have a definite height, so next/image fill works on the left panel.
     */
    <div className='grid h-screen w-full bg-white p-3 gap-3 lg:grid-cols-[42%_1fr]'>

      {/* ── Left: Brand cover ───────────────────────────────── */}
      <div className='hidden lg:block relative overflow-hidden rounded-2xl'>
        <Image
          src='/images/auth/brand-cover.png'
          alt='Brand cover'
          fill
          unoptimized
          className='object-cover'
          priority
        />
      </div>

      {/* ── Right: Form panel ───────────────────────────────── */}
      <div className='flex flex-col items-center justify-center px-6 py-12 overflow-y-auto'>
        <div className='w-full max-w-md'>{children}</div>
      </div>

    </div>
  );
}
