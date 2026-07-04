'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Menu } from 'lucide-react';

import { NAV_LINKS } from './links';
import Logo from '@/components/global/logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const SOCIAL_LINKS = [
  {
    socialIcon: '/images/landing/icon/twitter.svg',
    href: 'https://twitter.com/xental',
    label: 'Twitter',
  },
  {
    socialIcon: '/images/landing/icon/github.svg',
    href: 'https://github.com/xental',
    label: 'GitHub',
  },
  {
    socialIcon: '/images/landing/icon/linkedin.svg',
    href: 'https://linkedin.com/company/xental',
    label: 'LinkedIn',
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  // Track mount so we only portal after hydration
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);

  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  // Close the mobile menu automatically if the screen is resized to 'md' (768px) or larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  const panel = (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden transition-all duration-500 ease-in-out',
        open
          ? 'translate-y-0 visible pointer-events-auto'
          : '-translate-y-full invisible pointer-events-none'
      )}
    >
      {/* ── Header: close | logo ──────────────────────────── */}
      <div className='flex items-center justify-between px-6 py-5'>
        <button
          onClick={() => setOpen(false)}
          aria-label='Close navigation menu'
          className='flex items-center justify-center'
        >
          <X className='h-6 w-6 text-foreground' />
        </button>

        <div onClick={() => setOpen(false)}>
          <Logo />
        </div>

        {/* Spacer to keep logo centered */}
        <div className='w-6' />
      </div>

      {/* ── Nav links ────────────────────────────────────── */}
      <nav className='flex flex-1 flex-col items-center justify-center gap-8'>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className='text-base font-semibold tracking-widest text-foreground transition-colors hover:text-primary'
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ── Secondary links + socials ─────────────────────── */}
      <div className='flex flex-col items-center gap-6 pb-14'>
        <div className='flex flex-col w-full px-8 gap-3'>
          <Button size='lg' asChild className='bg-primary w-full'>
            <Link href='/signup' onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </Button>
          <Button
            size='lg'
            variant='outline'
            asChild
            className='w-full bg-transparent border-[#d4d4d4] hover:bg-gray-50'
          >
            <Link href='/login' onClick={() => setOpen(false)}>
              Log in
            </Link>
          </Button>
          <Button
            size='lg'
            variant='ghost'
            asChild
            className='w-full text-muted-foreground'
          >
            <Link href='/api-docs' onClick={() => setOpen(false)}>
              API Docs
            </Link>
          </Button>
        </div>

        <div className='flex items-center gap-6'>
          {SOCIAL_LINKS.map(({ socialIcon, href, label }) => (
            <Link
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <Image
                src={socialIcon}
                alt={label}
                width={20}
                height={20}
                className='h-5 w-5'
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label='Open navigation menu'
        className='flex items-center justify-center p-2'
      >
        <Menu className='h-7 w-7 text-foreground' />
      </button>

      {/* Portal: renders at document.body, escaping the navbar's
          backdrop-filter containing block so fixed inset-0 always
          covers the full viewport regardless of scroll position. */}
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
