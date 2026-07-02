import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Button } from '../ui/button';
import Link from 'next/link';

const CtaBanner = () => {
  return (
    <section className='py-15'>
      <div className='container'>
        <div className='min-h-[529px] bg-secondary px-6 flex flex-col items-center justify-center gap-5 text-center rounded-[24px]'>
          <SectionHeader
            title={
              <h2 className='text-2xl md:text-3xl font-semibold text-white lg:text-5xl'>
                Infrastructure that Scales with
                <br className='hidden md:block' />
                your Business
              </h2>
            }
            description={
              <p className='text-white/80 text-base md:text-xl'>
                From customer onboarding to real-time reconciliation, Xental
                powers reliable <br className='hidden md:block' />
                payment operations for businesses handling high-volume bank
                transfers.
              </p>
            }
          />

          <div className='w-full flex flex-col justify-center sm:flex-row gap-4'>
            <Button size='lg' asChild className='bg-primary w-full md:w-fit'>
              <Link href='/signup'>Get Started</Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              asChild
              className='bg-transparent w-full md:w-fit border-[#d4d4d4] text-white hover:bg-white/10 hover:text-white'
            >
              <Link href='/api-docs'>API Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
