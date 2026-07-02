'use client';

import { ArrowDownLeft, ArrowUpRight, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import TransactionTable from '@/components/dashboard/TransactionTable';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Home</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Welcome back. Here&apos;s an overview of your account today
          </p>
        </div>
        <Button size='sm' className='gap-1.5' onClick={() => toast.info('Export coming soon — wire to API first')}>
          <Download className='w-3.5 h-3.5' />
          Export
        </Button>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <StatCard label='Total Pay-ins' value='₦550,000' trend='up' trendValue='12%' icon={ArrowDownLeft} iconColor='text-success' />
        <StatCard label='Total Pay-outs' value='₦250,000' trend='up' trendValue='12%' icon={ArrowUpRight} iconColor='text-action-blue' />
        <StatCard label='Pending Transactions' value='5' trend='up' trendValue='12%' icon={Clock} iconColor='text-pending' />
      </div>

      <AnalyticsChart title='Transaction analytics' />
      <TransactionTable title='Recent transactions' />
    </div>
  );
}
