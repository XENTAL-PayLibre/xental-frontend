'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';

export default function PayOutsPage() {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div>
        <h1 className='text-[22px] font-bold text-foreground'>Pay-outs</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>
          Monitor and track all outgoing payments from your platform
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard
          label='Total payouts'
          value='₦0'
          icon='/images/dashboard/pay-out.svg'
        />
        <StatCard
          label='Successful'
          value='0'
          icon='/images/dashboard/successful.svg'
        />
        <StatCard
          label='Failed'
          value='0'
          icon='/images/dashboard/failed.svg'
        />
      </div>

      {/* Empty State */}
      <div className='bg-white rounded-[12px] flex flex-col items-center justify-center flex-1 py-20 text-center'>
        <h3 className='text-base font-medium text-foreground mb-1.5'>
          No payout activity
        </h3>
        <p className='text-base text-muted mb-6'>
          Payouts will appear here once a payout has been processed for your
          platform
        </p>
        <Button
          onClick={() => router.push('/dashboard/customers')}
          className='h-[40px]! bg-action-blue hover:bg-action-blue/90 text-white rounded-lg px-6 h-9 text-xs font-medium'
        >
          View customers
        </Button>
      </div>
    </div>
  );
}
