'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Wallet,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Balances', href: '/dashboard/balances', icon: Wallet },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Pay-ins', href: '/dashboard/pay-ins', icon: ArrowDownLeft },
  { label: 'Pay-outs', href: '/dashboard/pay-outs', icon: ArrowUpRight },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className='flex h-full w-[220px] shrink-0 flex-col border-r border-stroke-2 bg-white px-3 py-5'>
      {/* Logo */}
      <div className='px-2 mb-6'>
        <Image
          src='/images/full-logo.svg'
          alt='Xental'
          width={110}
          height={32}
          className='object-contain'
        />
      </div>

      {/* Nav */}
      <p className='text-[10px] font-semibold uppercase tracking-widest text-xental-text-primary-400 px-2 mb-2'>
        Menu
      </p>
      <nav className='flex flex-col gap-0.5 flex-1'>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-action-blue-surface text-action-blue font-medium'
                  : 'text-xental-text-primary-500 hover:bg-xental-bg'
              )}
            >
              <Icon className='w-4 h-4 shrink-0' />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* PayLibre card */}
      <div
        className='mt-4 rounded-2xl overflow-hidden relative h-[110px] flex items-end p-3'
        style={{ backgroundImage: "url('/images/paylibrefooter.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent rounded-2xl' />
        <div className='relative flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow'>
            <span className='text-[10px] font-bold text-action-blue leading-none'>PL</span>
          </div>
          <span className='text-white text-sm font-semibold drop-shadow'>PayLibre</span>
        </div>
      </div>
    </aside>
  );
}
