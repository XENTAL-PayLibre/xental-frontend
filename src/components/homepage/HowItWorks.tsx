import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const howItWorks = [
  {
    id: 1,
    icon: '/images/landing/register.svg',
    title: 'Register & Complete KYB',
    description:
      'Business registers and completes Know Your Business verification for compliance.',
  },
  {
    id: 2,
    icon: '/images/landing/customers.svg',
    title: 'Create Customers',
    description: 'Create customers through Xental’s simple and intuitive APIs.',
  },
  {
    id: 3,
    icon: '/images/landing/dva.svg',
    title: 'Dedicated Virtual Accounts',
    description:
      'Xental provisions dedicated virtual accounts (DVA) for each customer automatically.',
  },
  {
    id: 4,
    icon: '/images/landing/uses-dva.svg',
    title: 'Customer Uses DVA',
    description:
      'Customers make bank transfers to their dedicated virtual account numbers.',
  },
  {
    id: 5,
    icon: '/images/landing/reconcile.svg',
    title: 'Automatic Reconciliation',
    description:
      'Xental reconciles payments automatically, matching to the correct customer.',
  },
  {
    id: 6,
    icon: '/images/landing/notification.svg',
    title: 'Real-Time Notifications',
    description:
      'Business receives instant transaction updates via webhooks and dashboard.',
  },
];

const HowItWorks = () => {
  return (
    <section className='bg-secondary py-20'>
      <div className='container'>
        <SectionHeader
          badge='How It Works'
          badgeClass='bg-white/10 text-white'
          title={
            <h2 className='text-3xl font-semibold text-white lg:text-5xl'>
              A Complete Payment Gateway Solution{' '}
              <br className='hidden md:block' />
              Designed for your Business
            </h2>
          }
          description={
            <p className='text-white/80'>
              Enterprise-grade infrastructure that automates every step of the
              payment lifecycle
            </p>
          }
        />

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {howItWorks.map((step) => (
            <div
              key={step.id}
              className='min-h-[219px] bg-white/5 border border-white/10 p-6 flex flex-col items-center gap-4 rounded-[14px]'
            >
              <Image src={step.icon} alt={step.title} width={48} height={48} />
              <h3 className='font-medium text-[20px] text-white text-center'>
                {step.title}
              </h3>
              <p className='text-sm text-white text-center leading-[1.5]'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
