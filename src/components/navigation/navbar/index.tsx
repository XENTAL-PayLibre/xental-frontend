'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MobileNav from './mobile-navbar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from './links';
import Logo from '@/components/global/logo';

const Navbar = () => {
  const [scrolling, setIsScrolling] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScrollEvent = () => {
      setIsScrolling(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);
  return (
    <nav
      className={cn(
        'fixed left-0 right-0 h-[72px] items-center flex top-0 z-50 border-b border-gray-100 transition-all duration-300',
        scrolling ? 'bg-white/90  shadow-xs backdrop-blur-md' : 'bg-white/20 '
      )}
    >
      <div className='container flex items-center justify-between'>
        <Logo />

        <div className='hidden md:flex items-center justify-center gap-4 lg:gap-12'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-muted-foreground font-medium hover:text-primary'
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            size='lg'
            variant='outline'
            asChild
            className='w-[80px] lg:w-[100px] hidden md:inline-flex md:border-transparent md:hover:bg-transparent lg:border-input lg:hover:bg-accent lg:hover:text-accent-foreground rounded-[8px] font-semibold text-foreground transition-colors'
          >
            <Link href='/login'>Log in</Link>
          </Button>
          <Button
            size='lg'
            asChild
            className='w-[126px] hidden md:inline-flex rounded-[8px]'
          >
            <Link href='/signup'>Get Started</Link>
          </Button>
          <div className='md:hidden'>
            <MobileNav key={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
