import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, text: 'Sign up your account' },
  { id: 2, text: 'Verify your business' },
  { id: 3, text: 'Set up your settlement account' },
];

const SignupContent = () => {
  return (
    <article>
      <SectionHeader
        align='left'
        titleClass='mb-2!'
        title={
          <h2 className='text-3xl font-semibold text-white leading-[1] lg:text-5xl'>
            Get started
            <br className='hidden md:block' />
            With us
          </h2>
        }
        description={
          <p className='text-white font-medium'>
            Complete these easy steps to register your account
          </p>
        }
      />
      <div className='flex gap-4'>
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'h-[178px] w-[230px] mt-[51px] flex items-center gap-4 rounded-[12px] p-8 text-sm text-white',
              step.id === 1 ? 'bg-white' : 'bg-white/10'
            )}
          >
            <div className='flex flex-col gap-4'>
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                  step.id === 1 ? 'bg-secondary' : 'bg-white/50'
                )}
              >
                {step.id}
              </div>
              <p
                className={cn(
                  'text-base font-medium',
                  step.id === 1 ? 'text-muted-foreground' : 'text-white'
                )}
              >
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default SignupContent;
