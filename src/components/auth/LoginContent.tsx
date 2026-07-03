import React from 'react';
import SectionHeader from '../ui/SectionHeader';

const LoginContent = () => {
  return (
    <article className='mb-[98px]'>
      <SectionHeader
        align='left'
        titleClass='mb-2!'
        title={
          <h2 className='text-3xl font-semibold text-white leading-[1] lg:text-5xl'>
            Welcome back
          </h2>
        }
        description={
          <p className='text-white font-medium'>
            Sign in to manage your account from one dashboard
          </p>
        }
      />
    </article>
  );
};

export default LoginContent;
