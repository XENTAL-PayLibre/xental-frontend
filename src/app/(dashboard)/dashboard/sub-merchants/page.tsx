'use client';

import { useState } from 'react';
import { Plus, Wallet, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubMerchantsList } from '@/api/sub-merchants';
import type { SubMerchantResponse } from '@/api/types/dashboard';
import { CreateSubMerchantModal } from '@/components/dashboard/sub-merchants/CreateSubMerchantModal';
import { PayoutAccountModal } from '@/components/dashboard/sub-merchants/PayoutAccountModal';
import { BalanceModal } from '@/components/dashboard/sub-merchants/BalanceModal';

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-50 text-success',
  Suspended: 'bg-red-50 text-destructive',
  Inactive: 'bg-xental-bg text-xental-text-primary-400',
};

export default function SubMerchantsPage() {
  const { data: subMerchants = [], isLoading } = useSubMerchantsList();
  const [createOpen, setCreateOpen] = useState(false);
  const [payoutFor, setPayoutFor] = useState<SubMerchantResponse | null>(null);
  const [balanceFor, setBalanceFor] = useState<SubMerchantResponse | null>(null);

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div>
          <h1 className='text-[22px] font-bold text-foreground'>Sub-merchants</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Onboard sellers under your platform and route their settlements
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className='gap-1.5 bg-action-blue hover:bg-action-blue/90'>
          <Plus className='w-4 h-4' /> New sub-merchant
        </Button>
      </div>

      <div className='bg-white rounded-[12px] px-4 py-4 flex-1'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Name</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Reference</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Payout account</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Status</th>
                <th className='text-right px-4 py-3 font-semibold text-foreground'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className='py-10 text-center text-xental-text-primary-400'>Loading sub-merchants...</td></tr>
              ) : subMerchants.length === 0 ? (
                <tr><td colSpan={5} className='py-10 text-center text-xental-text-primary-400'>No sub-merchants yet</td></tr>
              ) : (
                subMerchants.map((sm) => (
                  <tr key={sm.id} className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'>
                    <td className='px-4 py-3.5 text-foreground font-medium'>{sm.name}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500 font-mono'>{sm.reference}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>
                      {sm.hasPayoutAccount ? (
                        <span>{sm.settlementBankName} · {sm.settlementAccountNumber}</span>
                      ) : (
                        <span className='text-pending'>Not set</span>
                      )}
                    </td>
                    <td className='px-4 py-3.5'>
                      <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium', STATUS_BADGE[sm.status ?? ''] ?? 'bg-gray-50 text-gray-500')}>
                        {sm.status ?? '—'}
                      </span>
                    </td>
                    <td className='px-4 py-3.5 text-right'>
                      <div className='inline-flex items-center gap-3'>
                        <button type='button' onClick={() => setPayoutFor(sm)} className='inline-flex items-center gap-1 text-[11px] font-medium text-action-blue hover:opacity-80'>
                          <Landmark className='w-3.5 h-3.5' /> Payout
                        </button>
                        <button type='button' onClick={() => setBalanceFor(sm)} className='inline-flex items-center gap-1 text-[11px] font-medium text-xental-text-primary-500 hover:text-foreground'>
                          <Wallet className='w-3.5 h-3.5' /> Balance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateSubMerchantModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <PayoutAccountModal subMerchant={payoutFor} onClose={() => setPayoutFor(null)} />
      <BalanceModal subMerchant={balanceFor} onClose={() => setBalanceFor(null)} />
    </div>
  );
}
