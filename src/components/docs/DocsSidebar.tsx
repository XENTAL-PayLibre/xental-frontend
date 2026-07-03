'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDocsNav } from '@/lib/docs/nav';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();
  const nav = getDocsNav();

  return (
    <nav className='space-y-7'>
      {nav.map((group) => (
        <div key={group.title}>
          <p className='mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>
            {group.title}
          </p>
          <ul className='space-y-0.5'>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block rounded-md px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                        : 'text-xental-text-primary-500 hover:bg-sidebar-accent/50 hover:text-foreground',
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
