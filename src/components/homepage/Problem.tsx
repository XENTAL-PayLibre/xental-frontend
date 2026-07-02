import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';

const problems = [
  {
    id: 1,
    text: 'One collection account for thousands of customers',
  },
  {
    id: 2,
    text: 'Manual transaction matching',
  },
  {
    id: 3,
    text: 'Delayed payment confirmation',
  },
  {
    id: 4,
    text: 'Reconciliation errors',
  },
  {
    id: 5,
    text: 'Operational inefficiencies',
  },
  {
    id: 6,
    text: 'Poor visibility',
  },
];

const Problem = () => {
  return (
    <section className='bg-white pt-15 pb-10'>
      <div className='container'>
        <SectionHeader
          badge='The Problem'
          title="Manual Reconciliation Doesn't Scale"
          description='Traditional payment collection creates operational bottlenecks that slow your business down'
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {problems.map((problem) => (
            <div
              key={problem.id}
              className='min-h-[74px] flex gap-4 rounded-[16px] border border-gray-200 bg-white p-4 text-sm text-muted-foreground'
            >
              <Image
                src='/images/landing/close.svg'
                alt='Close Icon'
                width={24}
                height={24}
                className='shrink-0 self-start'
              />
              {problem.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
