import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <Link href='/' className='flex items-center'>
      <Image
        src='/images/full-logo.svg'
        alt='FitCall logo'
        width={132}
        height={40}
        sizes='true'
        className='h-10 w-33 object-contain'
      />
    </Link>
  );
};

export default Logo;
