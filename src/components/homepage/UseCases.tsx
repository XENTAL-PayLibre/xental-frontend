import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';

const useCases = [
  {
    id: 1,
    title: 'Savings & Investment Platforms',
    description:
      'Assign every member or investor a dedicated payment destination and automatically reconcile deposits in real time, providing accurate records without manual effort.',
    useCaseImg: '/images/landing/savings.png',
  },
  {
    id: 2,
    title: 'Schools & Education',
    description:
      'Automate school fee collection with dedicated accounts for each student and parent portal.',
    useCaseImg: '/images/landing/schools.png',
  },
  {
    id: 3,
    title: 'Property Management',
    description:
      'Simplify rent collection across multiple properties and clients with automatic payment tracking.',
    useCaseImg: '/images/landing/property.png',
  },
];

const UseCases = () => {
  return (
    <section className='pt-15 pb-20'>
      <div className='container'>
        <SectionHeader
          badge='Xental in Action'
          title={'Use Cases'}
          description={
            <>
              Xental offers a variety of use cases. Everyone from fintech
              startups to established <br className='hidden md:block' />
              enterprises, Xental powers payment collection at scale
            </>
          }
        />

        <div className='mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className='min-h-[600px] lg:min-h-[755px] bg-white flex flex-col gap-2 p-6 border rounded-[32px]'
            >
              <h3 className='text-xl text-muted-foreground font-semibold mb-4'>
                {useCase.title}
              </h3>
              <p className='text-base text-muted'>{useCase.description}</p>
              <Image
                src={useCase.useCaseImg}
                alt={useCase.title}
                width={362.67}
                height={346}
                className='w-full h-auto mt-auto'
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
