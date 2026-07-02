import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const solutions = [
  {
    id: 1,
    icon: '/images/landing/wallet.svg',
    title: 'Dedicated Virtual Accounts',
    description:
      'Assign every customer a unique account number for seamless payment tracking and collection.',
  },
  {
    id: 2,
    icon: '/images/landing/checklist.svg',
    title: 'Automatic reconciliation',
    description:
      'Match payments to customers instantly without manual intervention or spreadsheets.',
  },
  {
    id: 3,
    icon: '/images/landing/timer.svg',
    title: 'Real-time updates',
    description:
      'Receive transaction events as payments happen via webhooks and live dashboards.',
  },
  {
    id: 4,
    icon: '/images/landing/infra.svg',
    title: 'Multi-tenant Infrastructure',
    description:
      'Support multiple businesses securely with isolated data and complete compliance.',
  },
  {
    id: 5,
    icon: '/images/landing/dev.svg',
    title: 'Developer APIs',
    description:
      'Integrate quickly using REST APIs, webhooks, and comprehensive documentation.',
  },
  {
    id: 6,
    icon: '/images/landing/chart.svg',
    title: 'Transaction Tracking',
    description:
      'Automatically manage underpayments, and duplicate transactions.',
  },
];

const Solution = () => {
  return (
    <section className='bg-white pt-10 pb-20'>
      <div className='container'>
        <SectionHeader
          badge='The Solution'
          title={
            <h2 className='text-3xl font-semibold text-muted-foreground leading-[1.2] lg:text-5xl'>
              Built for Modern Payment <br className='hidden md:block' />
              Collection
            </h2>
          }
          description={
            'Enterprise-grade infrastructure that automates every step of the payment lifecycle'
          }
        />

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className={cn(
                'min-h-[250px] p-6 flex flex-col gap-4 rounded-[14px]',
                solution.id === 1 ? 'bg-primary/10 rotate-[-1.75deg]' : 'border'
              )}
            >
              <Image
                src={solution.icon}
                alt={solution.title}
                width={48}
                height={48}
              />
              <h3 className='font-medium text-[20px] text-muted-foreground'>
                {solution.title}
              </h3>
              <p
                className={cn(
                  'text-sm',
                  solution.id === 1 ? 'text-muted-foreground' : 'text-muted'
                )}
              >
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
