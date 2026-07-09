'use client';
import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  {
    id: 7,
    icon: '/images/landing/reconcile.svg',
    title: 'Programmable Payment Flows',
    description:
      'Automate holds, releases, alerts and reviews the moment a payment reconciles — no code required.',
  },
  {
    id: 8,
    icon: '/images/landing/customers.svg',
    title: 'Collections Intelligence',
    description:
      'Receivables aging, cash-flow forecasting, and a reliability score for every customer.',
  },
  {
    id: 9,
    icon: '/images/landing/notification.svg',
    title: 'AI Copilot & MCP',
    description:
      'Ask about your account in plain English, or let any AI agent operate it through our MCP server.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Solution = () => {
  return (
    <section id="solution" className='bg-white pt-10 pb-20 scroll-mt-16'>
      <div className='container'>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
        >
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
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {solutions.map((solution) => (
            <motion.div
              variants={itemVariants}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
