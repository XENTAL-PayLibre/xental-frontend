import Hero from '@/components/homepage/Hero';
import HowItWorks from '@/components/homepage/HowItWorks';
import Problem from '@/components/homepage/Problem';
import Solution from '@/components/homepage/Solution';
import UseCases from '@/components/homepage/UseCases';
import Experience from '@/components/homepage/Experience';
import React from 'react';
import CtaBanner from '@/components/homepage/CtaBanner';

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <UseCases />
      <Experience />
      <CtaBanner />
    </main>
  );
};

export default HomePage;
