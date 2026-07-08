'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useInsights } from '@/api/dashboard';
import { useSettlementConfig } from '@/api/settlement';
import { useCreateTransfer } from '@/api/transfers';

function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className='relative'>
      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-xental-text-primary-400'>₦</span>
      <input
        type='text'
        inputMode='numeric'
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder='0.00'
        className='w-full h-11 pl-7 pr-3 rounded-lg border border-stroke-2 text-sm outline-none focus:border-action-blue focus:ring-2 focus:ring-action-blue/20 transition-colors'
      />
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <label className='text-xs font-medium text-xental-text-primary-500'>{label}</label>;
}

export default function BalancesPage() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: settlement } = useSettlementConfig();
  const withdraw = useCreateTransfer();

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const fmt = (v: string) => (v ? `₦${Number(v).toLocaleString()}` : '');

  const totalBalance = (insights?.totalCollectedKobo || 0) / 100;
  const formattedTotalBalance = `₦${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const hasSettlementAccount = !!(settlement?.settlementAccountNumber && settlement?.settlementBankCode);

  const handleWithdraw = () => {
    if (!withdrawAmount || !hasSettlementAccount) return;
    withdraw.mutate(
      {
        merchantTxRef: `withdraw_${Date.now()}`,
        amountKobo: Number(withdrawAmount) * 100,
        accountNumber: settlement!.settlementAccountNumber!,
        bankCode: settlement!.settlementBankCode!,
        narration: 'Balance withdrawal',
      },
      {
        onSuccess: () => {
          setWithdrawOpen(false);
          setWithdrawAmount('');
        },
      }
    );
  };

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className='text-xl font-bold text-foreground'>Balance Details</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>Monitor your funds here</p>
      </div>

      <div className='bg-white rounded-xl border border-stroke-2 p-6 max-w-sm'>
        <div className='flex items-center gap-1.5 mb-2'>
          <Wallet className='w-4 h-4 text-success' />
          <span className='text-xs text-xental-text-primary-400'>Total Balance</span>
        </div>
        <p className='text-3xl font-bold text-foreground mb-4'>
          {insightsLoading ? '...' : formattedTotalBalance}
        </p>
        <div className='flex items-center gap-2'>
          <Button size='sm' className='px-5' onClick={() => setWithdrawOpen(true)}>
            Withdraw
          </Button>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal open={withdrawOpen} onClose={() => { setWithdrawOpen(false); setWithdrawAmount(''); }} title='Withdraw Funds'>
        <div className='flex flex-col gap-4'>
          <p className='text-xs text-xental-text-primary-400 -mt-3'>Funds will be sent to your registered settlement account.</p>

          {hasSettlementAccount ? (
            <>
              <div className='flex flex-col gap-1'>
                <FieldLabel label='Amount' />
                <AmountInput value={withdrawAmount} onChange={setWithdrawAmount} />
              </div>
              <div className='flex flex-col gap-1'>
                <FieldLabel label='Settlement account' />
                <div className='h-11 px-3 rounded-lg border border-stroke-2 bg-xental-bg flex flex-col justify-center'>
                  <p className='text-sm text-foreground font-medium'>
                    {settlement?.settlementAccountName ?? 'Settlement account'} · Bank {settlement?.settlementBankCode}
                  </p>
                  <p className='text-xs text-xental-text-primary-400'>{settlement?.settlementAccountNumber}</p>
                </div>
              </div>
              {withdrawAmount && (
                <div className={cn('rounded-lg px-3 py-2.5 text-xs', Number(withdrawAmount) > totalBalance ? 'bg-red-50 text-destructive' : 'bg-xental-bg text-xental-text-primary-500')}>
                  {Number(withdrawAmount) > totalBalance
                    ? `Insufficient balance. Available: ${formattedTotalBalance}`
                    : <>You will withdraw <span className='font-semibold text-foreground'>{fmt(withdrawAmount)}</span>. Available: {formattedTotalBalance}</>}
                </div>
              )}
              <div className='flex gap-2 mt-1'>
                <Button variant='outline' className='flex-1' onClick={() => { setWithdrawOpen(false); setWithdrawAmount(''); }}>Cancel</Button>
                <Button className='flex-1' onClick={handleWithdraw} disabled={!withdrawAmount || Number(withdrawAmount) > totalBalance || withdraw.isPending}>
                  {withdraw.isPending ? 'Processing…' : 'Confirm Withdrawal'}
                </Button>
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-3'>
              <div className='bg-xental-bg rounded-lg px-3 py-2.5 text-xs text-xental-text-primary-500'>
                No settlement account is set. Add one before you can withdraw.
              </div>
              <Link href='/dashboard/settings' className='self-end'>
                <Button size='sm'>Go to Settings</Button>
              </Link>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
