'use client';
import Image from 'next/image';
import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className='py-20'>
      <div className='container'>
        <div className='relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='
            flex flex-col items-center gap-2 pb-8 text-center
            md:absolute md:inset-x-0 md:top-10 lg:top-20 md:pb-0 md:z-10
          '
          >
            <SectionHeader
              className='md:mb-2 lg:mb-6'
              title={
                <h2 className='text-3xl font-semibold text-muted-foreground leading-[1.2] lg:text-5xl'>
                  Automate Payments with <br className='hidden md:block' />
                  Dedicated Virtual Accounts
                </h2>
              }
              description={
                <>
                  Xental enables businesses to create customer-specific virtual
                  accounts, <br className='hidden md:block' /> automatically
                  reconcile incoming transfers, and eliminate manual payment{' '}
                  <br className='hidden md:block' />
                  matching.
                </>
              }
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='flex gap-4'
            >
              <Button size='lg' asChild className='bg-primary'>
                <Link href='/signup'>Get Started</Link>
              </Button>
              <Button
                size='lg'
                asChild
                className='bg-secondary hover:bg-secondary/90'
              >
                <Link href='/api-docs'>API Docs</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero image — hidden on mobile, visible on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <Image
              src='/images/landing/hero.png'
              alt='Hero'
              width={1280}
              height={797}
              className='w-full h-auto hidden md:block'
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
