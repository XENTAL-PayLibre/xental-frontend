import React from 'react';
import Image from 'next/image';

interface AuthShellProps {
  left?: React.ReactNode;
  right: React.ReactNode;
}

export default function AuthShell({ left, right }: AuthShellProps) {
  return (
    <div className='grid h-screen w-full bg-white p-3 gap-3 lg:grid-cols-[55%_1fr]'>
      {/* ── Left: Brand cover ───────────────────────────────── */}
      <div className='hidden lg:block relative overflow-hidden rounded-[24px]'>
        <Image
          src='/images/auth/brand-cover.png'
          alt='Brand cover'
          fill
          unoptimized
          className='object-cover'
          priority
        />

        <div className='absolute inset-0 mx-13 my-10'>
          <Image
            src='/images/full-logo(white).svg'
            alt='Full logo'
            width={200}
            height={100}
            unoptimized
          />
        </div>

        {left && <div className='absolute inset-x-13 bottom-10'>{left}</div>}
      </div>

      {/* ── Right: Form panel ───────────────────────────────── */}
      <div className='flex flex-col items-center justify-center sm:px-6 py-12 overflow-y-auto'>
        <div className='w-full sm:max-w-125 px-1 lg:p-4'>{right}</div>
      </div>
    </div>
  );
}
