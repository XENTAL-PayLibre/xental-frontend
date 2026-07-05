import Link from 'next/link';

import Logo from '@/components/global/logo';
import { FOOTER_LINKS } from './links';
import Image from 'next/image';

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

const Footer = () => {
  return (
    <footer className='bg-white'>
      <div className='container py-16!'>
        {/* ── Top: Brand + Nav columns ─────────────────────────── */}
        <div className='pb-16 grid grid-cols-2 gap-8 md:grid-cols-[1.5fr_repeat(4,1fr)]'>
          {/* Brand column */}
          <div className='col-span-2 md:col-span-1 flex flex-col gap-3'>
            <Logo />
            <p className='text-sm leading-5 text-muted max-w-[180px]'>
              Infrastructure for Smarter Payments
            </p>
          </div>

          {/* Nav columns */}
          {FOOTER_LINKS.map((group) => (
            <nav key={group.heading} className='flex flex-col gap-4'>
              <h3 className='text-sm font-semibold text-muted-foreground mb-4 md:mb-6'>
                {group.heading}
              </h3>
              <ul className='flex flex-col gap-3'>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='text-sm text-muted transition-colors hover:text-foreground'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <hr className='border-stroke-1' />

        {/* ── Bottom: Copyright + Social icons ─────────────────── */}
        <div className='pt-14 pb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Xental. All rights reserved.
          </p>

          <div className='flex items-center gap-4'>
            {SOCIAL_LINKS.map(({ socialIcon, href, label }) => (
              <Link
                key={label}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={label}
                className='text-muted transition-colors hover:text-muted-foreground'
              >
                <img
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
    </footer>
  );
};

export default Footer;
