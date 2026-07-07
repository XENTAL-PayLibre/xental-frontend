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
  X,
  LogOut,
  Activity,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { removeToken, COOKIE_KEYS } from '@/lib/get-token';
import { cn } from '@/lib/utils';
import { useProfile } from '@/api/dashboard';

const NAV_ITEMS = [
  { label: 'Onboarding', href: '/admin/onboarding', icon: Users },
  { label: 'Reconciliation', href: '/admin/reconciliation', icon: Activity },
  { label: 'Admin Management', href: '/admin/admins', icon: Shield },
];

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    removeToken(COOKIE_KEYS.admin_token);
    router.push('/admin/login');
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
            href === '/admin' ? pathname === href : pathname.startsWith(href);
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

      <nav className='flex flex-col gap-0.5 mt-auto mb-2'>
        <Link
          href='/admin/settings'
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors',
            pathname.startsWith('/admin/settings')
              ? 'bg-action-blue-surface text-action-blue font-medium'
              : 'text-xental-text-primary-500 hover:bg-xental-bg'
          )}
        >
          <Settings className='w-4 h-4 shrink-0' />
          Settings
        </Link>
        <Link
          href='/admin/support'
          onClick={onNavigate}
          className='flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors text-xental-text-primary-500 hover:bg-xental-bg'
        >
          <HelpCircle className='w-4 h-4 shrink-0' />
          Support
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className='flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-xental-text-primary-500 hover:bg-red-50 hover:text-destructive transition-colors w-full mb-2'
      >
        <LogOut className='w-4 h-4 shrink-0' />
        Log out
      </button>

      {/* Admin details */}
      <div className='flex items-center gap-2 mt-4 px-2'>
        <div className='flex flex-col min-w-0'>
          <span className='text-sm font-semibold text-foreground truncate'>Admin Portal</span>
          <span className='text-xs text-xental-text-primary-400 truncate'>Xental Staff</span>
        </div>
      </div>
    </aside>
  );
}
