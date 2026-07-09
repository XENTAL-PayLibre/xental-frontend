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
  RefreshCw,
  Store,
  Zap,
  TrendingUp,
  Settings,
  X,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { postRequest } from '@/lib/http';
import { clearAuthCookies } from '@/lib/get-token';
import { cn } from '@/lib/utils';
import { useProfile } from '@/api/dashboard';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Balances', href: '/dashboard/balances', icon: Wallet },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Pay-ins', href: '/dashboard/pay-ins', icon: ArrowDownLeft },
  { label: 'Pay-outs', href: '/dashboard/pay-outs', icon: ArrowUpRight },
  { label: 'Billing', href: '/dashboard/billing', icon: RefreshCw },
  { label: 'Flows', href: '/dashboard/flows', icon: Zap },
  { label: 'Collections', href: '/dashboard/collections', icon: TrendingUp },
  { label: 'Sub-merchants', href: '/dashboard/sub-merchants', icon: Store },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const {data: profile} = useProfile();

  const initials =
    (profile?.name ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'U';

  async function handleLogout() {
    try {
      await postRequest({ url: '/developers/logout', payload: {} });
    } catch {
      // ignore — clear client state regardless
    }
    clearAuthCookies();
    if (typeof window !== 'undefined') localStorage.removeItem('has_refresh_token');
    router.push('/login');
  }

  return (
    <aside className='w-[220px] shrink-0 flex flex-col h-screen bg-white border-r border-stroke-2 px-3 py-5'>
      {/* Logo + mobile close */}
      <div className='px-2 mb-6 flex items-center justify-between'>
        <Image
          src='/images/full-logo.svg'
          alt='Xental'
          width={110}
          height={32}
          className='object-contain'
        />
        {onNavigate && (
          <button onClick={onNavigate} className='lg:hidden p-1 rounded hover:bg-xental-bg'>
            <X className='w-4 h-4 text-xental-text-primary-400' />
          </button>
        )}
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className='flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-xental-text-primary-500 hover:bg-red-50 hover:text-destructive transition-colors w-full mb-2'
      >
        <LogOut className='w-4 h-4 shrink-0' />
        Log out
      </button>

      {/* PayLibre card */}
      <div
        className='mt-4 rounded-2xl overflow-hidden relative h-[110px] flex items-end p-3'
        style={{ backgroundImage: "url('/images/paylibrefooter.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent rounded-2xl' />
        <div className='relative flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow'>
            <span className='text-[10px] font-bold text-action-blue leading-none'>{initials}</span>
          </div>
          <span className='text-white text-sm font-semibold drop-shadow'>{profile?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </aside>
  );
}
