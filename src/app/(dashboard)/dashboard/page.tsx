'use client';

import { ArrowDownLeft, ArrowUpRight, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Button } from '@/components/ui/button';
import { useInsights, useProfile } from '@/api/dashboard';
import { koboToNaira } from '@/lib/utils';

export default function DashboardHome() {
  const { data: profile } = useProfile();
  const { data: insights, isLoading } = useInsights();

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Home</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            {profile?.name
              ? `Welcome back, ${profile.name.split(' ')[0]}`
              : 'Welcome back'}
          </p>
        </div>
        <Button
          size='sm'
          className='gap-1.5'
          onClick={() => toast.info('Export coming soon')}
        >
          <Download className='w-3.5 h-3.5' />
          Export
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          label='Total Pay-ins'
          value={
            isLoading ? '—' : koboToNaira(insights?.totalCollectedKobo ?? 0)
          }
          icon={'/images/dashboard/pay-in.svg'}
        />
        <StatCard
          label='Successful'
          value={isLoading ? '—' : String(insights?.virtualAccounts ?? 0)}
          icon={'/images/dashboard/successful.svg'}
        />
        <StatCard
          label='Failed'
          value={isLoading ? '—' : String(insights?.pendingReview ?? 0)}
          icon={'/images/dashboard/failed.svg'}
        />
      </div>

      <AnalyticsChart title='Transaction analytics' />
      <TransactionTable title='Recent transactions' />
    </div>
  );
}
