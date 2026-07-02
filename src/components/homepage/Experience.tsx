import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

const experience = [
  { id: 1, text: 'RESTful APIs with comprehensive documentation' },
  { id: 2, text: 'Real-time webhooks for transaction events' },
  { id: 3, text: 'OAuth 2.0 and API key authentication' },
  { id: 4, text: 'SDKs for Node.js, Python, and PHP' },
  { id: 5, text: 'Sandbox environment for testing' },
  { id: 6, text: 'Postman collection included' },
];

const Experience = () => {
  return (
    <section className='pt-15 pb-20'>
      <div className='container'>
        <SectionHeader
          badge='Developer Experience'
          title={
            <h2 className='text-3xl font-semibold text-muted-foreground lg:text-5xl'>
              Developer-First Infrastructure
            </h2>
          }
          description={
            'Integrate in minutes with our intuitive APIs and comprehensive documentation'
          }
        />

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-15 xl:gap-[113px]'>
          <div className='flex justify-center'>
            <Image
              src='/images/landing/terminal.png'
              alt='Developer Experience'
              width={584}
              height={316}
              className='w-full h-auto'
            />
          </div>
          <div className='flex flex-col gap-5'>
            {experience.map((item) => (
              <div key={item.id} className='flex gap-4 text-muted-foreground'>
                <Image
                  src='/images/landing/bulletpoint.svg'
                  alt='Bullet Point Icon'
                  width={24}
                  height={24}
                  className='shrink-0 self-start'
                />
                {item.text}
              </div>
            ))}
            <Button size='lg' asChild className='bg-primary w-fit mt-auto'>
              <Link href='/api-docs'>View API Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
