'use client';

import Link from 'next/link';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useOnboardingStatus, onboardingBanner } from '@/api/onboarding';
import { cn } from '@/lib/utils';

const TONES = {
  info: { wrap: 'border-xental-blue-200 bg-xental-blue-50', icon: 'text-xental-blue-700', Icon: Info },
  warning: { wrap: 'border-[#f5d9a8] bg-[#fff7ed]', icon: 'text-status-pending-1', Icon: AlertTriangle },
  error: { wrap: 'border-failed-surface bg-failed-surface', icon: 'text-failed', Icon: AlertTriangle },
};

/** Always shown on the dashboard while the account can't yet issue live keys. */
export default function OnboardingBanner() {
  const { data } = useOnboardingStatus();
  const banner = onboardingBanner(data);
  if (!banner) return null;
  const t = TONES[banner.tone];

  return (
    <div className={cn('mb-5 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between', t.wrap)}>
      <div className='flex items-start gap-3'>
        <t.Icon className={cn('mt-0.5 h-5 w-5 shrink-0', t.icon)} />
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-foreground'>{banner.title}</p>
          <p className='mt-0.5 text-sm text-xental-text-primary-500'>{banner.body}</p>
        </div>
      </div>
      <Link
        href='/onboarding'
        className='inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-action-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-action-blue/90'
      >
        Complete profile <ArrowRight className='h-4 w-4' />
      </Link>
    </div>
  );
}
