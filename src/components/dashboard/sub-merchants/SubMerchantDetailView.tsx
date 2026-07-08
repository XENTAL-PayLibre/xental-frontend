'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useSubMerchantsList, useSubMerchantBalance } from '@/api/sub-merchants';
import { useVirtualAccountsList } from '@/api/virtual-accounts';
import { CustomersTable } from '@/components/dashboard/customers/CustomersTable';
import { PayoutAccountModal } from '@/components/dashboard/sub-merchants/PayoutAccountModal';

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-50 text-success',
  Suspended: 'bg-red-50 text-destructive',
  Inactive: 'bg-xental-bg text-xental-text-primary-400',
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-xs text-xental-text-primary-400'>{label}</span>
      <span className='text-sm font-medium text-foreground'>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className='bg-white rounded-[12px] border border-stroke-2 px-4 py-4'>
      <p className='text-xs text-xental-text-primary-400'>{label}</p>
      <p className='text-lg font-bold text-foreground mt-1'>{value}</p>
    </div>
  );
}

export function SubMerchantDetailView({ id }: { id: string }) {
  const { data: subMerchants = [], isLoading: smLoading } = useSubMerchantsList();
  const subMerchant = subMerchants.find((s) => s.id === id);
  const { data: balance } = useSubMerchantBalance(id);
  const { data: customers = [], isLoading: custLoading } = useVirtualAccountsList(subMerchant?.reference ?? undefined);
  const [payoutOpen, setPayoutOpen] = useState(false);

  if (smLoading) {
    return <div className='p-8 text-center text-xental-text-primary-400'>Loading sub-merchant…</div>;
  }
  if (!subMerchant) {
    return <div className='p-8 text-center text-destructive'>Sub-merchant not found</div>;
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col gap-3'>
        <Link href='/dashboard/sub-merchants' className='flex items-center gap-2 text-sm text-xental-text-primary-400 hover:text-foreground transition-colors w-fit'>
          <ArrowLeft className='w-4 h-4' /> Back to sub-merchants
        </Link>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold text-foreground'>{subMerchant.name}</h1>
            <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium', STATUS_BADGE[subMerchant.status ?? ''] ?? 'bg-gray-50 text-gray-500')}>
              {subMerchant.status ?? '—'}
            </span>
          </div>
          <Button variant='outline' size='sm' className='gap-1.5' onClick={() => setPayoutOpen(true)}>
            <Landmark className='w-3.5 h-3.5' /> {subMerchant.hasPayoutAccount ? 'Update payout account' : 'Set payout account'}
          </Button>
        </div>
      </div>

      {/* Balance */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <Stat label='Collected' value={koboToNaira(balance?.collectedKobo ?? 0)} />
        <Stat label='Settled' value={koboToNaira(balance?.settledKobo ?? 0)} />
        <Stat label='Pending' value={koboToNaira(balance?.pendingKobo ?? 0)} />
        <Stat label='Customers' value={String(balance?.virtualAccounts ?? customers.length)} />
      </div>

      {/* Details */}
      <div className='bg-white rounded-[12px] border border-stroke-2 px-6 py-6'>
        <h3 className='text-sm font-semibold text-foreground mb-4'>Details</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8'>
          <Detail label='Reference' value={subMerchant.reference ?? '—'} />
          <Detail
            label='Payout account'
            value={subMerchant.hasPayoutAccount ? `${subMerchant.settlementAccountName ?? ''} · ${subMerchant.settlementAccountNumber ?? ''}`.trim() : 'Not set'}
          />
          <Detail label='Platform fee' value={subMerchant.platformFeeBps != null ? `${subMerchant.platformFeeBps / 100}%` : '—'} />
          <Detail label='Created' value={formatDate(subMerchant.createdAtUtc)} />
        </div>
      </div>

      {/* Customers */}
      <div className='bg-white rounded-[12px] border border-stroke-2'>
        <div className='px-6 py-4 border-b border-stroke-2'>
          <h3 className='text-sm font-semibold text-foreground'>Customers</h3>
          <p className='text-xs text-xental-text-primary-400 mt-0.5'>Virtual accounts settling to this sub-merchant.</p>
        </div>
        <CustomersTable data={customers} isLoading={custLoading} />
      </div>

      <PayoutAccountModal subMerchant={payoutOpen ? subMerchant : null} onClose={() => setPayoutOpen(false)} />
    </div>
  );
}
