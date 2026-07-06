'use client';
import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const experience = [
  { id: 1, text: 'RESTful APIs with comprehensive documentation' },
  { id: 2, text: 'Real-time webhooks for transaction events' },
  { id: 3, text: 'OAuth 2.0 and API key authentication' },
  { id: 4, text: 'SDKs for Node.js, Python, and PHP' },
  { id: 5, text: 'Sandbox environment for testing' },
  { id: 6, text: 'Postman collection included' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const Experience = () => {
  return (
    <section id="experience" className='pt-15 pb-20 scroll-mt-16'>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-15 xl:gap-[113px]'>
          <motion.div 
            className='flex justify-center'
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src='/images/landing/terminal.png'
              alt='Developer Experience'
              width={584}
              height={316}
              className='w-full h-auto'
            />
          </motion.div>
          
          <motion.div 
            className='flex flex-col gap-5'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {experience.map((item) => (
              <motion.div variants={itemVariants} key={item.id} className='flex gap-4 text-muted-foreground'>
                <Image
                  src='/images/landing/bulletpoint.svg'
                  alt='Bullet Point Icon'
                  width={24}
                  height={24}
                  className='shrink-0 self-start'
                />
                {item.text}
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
              <Button size='lg' asChild className='bg-primary w-fit mt-auto'>
                <Link href='/api-docs'>View API Docs</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
