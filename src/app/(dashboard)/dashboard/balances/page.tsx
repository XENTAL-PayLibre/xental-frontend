'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

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
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fmt = (v: string) => v ? `₦${Number(v).toLocaleString()}` : '';

  const handleDeposit = async () => {
    if (!depositAmount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDepositOpen(false);
    setDepositAmount('');
    toast.success(`Deposit of ${fmt(depositAmount)} initiated successfully`);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setWithdrawOpen(false);
    setWithdrawAmount('');
    toast.success(`Withdrawal of ${fmt(withdrawAmount)} initiated successfully`);
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
        <p className='text-3xl font-bold text-foreground mb-4'>₦250,000</p>
        <div className='flex items-center gap-2'>
          <Button size='sm' className='px-5' onClick={() => setDepositOpen(true)}>Deposit</Button>
          <Button size='sm' variant='secondary' className='px-5 bg-xental-secondary-500 text-white hover:bg-xental-secondary-600' onClick={() => setWithdrawOpen(true)}>
            Withdraw
          </Button>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal open={depositOpen} onClose={() => { setDepositOpen(false); setDepositAmount(''); }} title='Deposit Funds'>
        <div className='flex flex-col gap-4'>
          <p className='text-xs text-xental-text-primary-400 -mt-3'>Enter the amount you want to deposit into your Xental wallet.</p>
          <div className='flex flex-col gap-1'>
            <FieldLabel label='Amount' />
            <AmountInput value={depositAmount} onChange={setDepositAmount} />
          </div>
          <div className='flex flex-col gap-1'>
            <FieldLabel label='Destination account' />
            <div className='h-11 px-3 rounded-lg border border-stroke-2 bg-xental-bg flex items-center text-sm text-xental-text-primary-500'>
              Xental Wallet · AjoVault
            </div>
          </div>
          {depositAmount && (
            <div className='bg-xental-bg rounded-lg px-3 py-2.5 text-xs text-xental-text-primary-500'>
              You will deposit <span className='font-semibold text-foreground'>{fmt(depositAmount)}</span> into your wallet.
            </div>
          )}
          <div className='flex gap-2 mt-1'>
            <Button variant='outline' className='flex-1' onClick={() => { setDepositOpen(false); setDepositAmount(''); }}>Cancel</Button>
            <Button className='flex-1' onClick={handleDeposit} disabled={!depositAmount || loading}>
              {loading ? 'Processing…' : 'Confirm Deposit'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal open={withdrawOpen} onClose={() => { setWithdrawOpen(false); setWithdrawAmount(''); }} title='Withdraw Funds'>
        <div className='flex flex-col gap-4'>
          <p className='text-xs text-xental-text-primary-400 -mt-3'>Funds will be sent to your registered settlement account.</p>
          <div className='flex flex-col gap-1'>
            <FieldLabel label='Amount' />
            <AmountInput value={withdrawAmount} onChange={setWithdrawAmount} />
          </div>
          <div className='flex flex-col gap-1'>
            <FieldLabel label='Settlement account' />
            <div className='h-11 px-3 rounded-lg border border-stroke-2 bg-xental-bg flex flex-col justify-center'>
              <p className='text-sm text-foreground font-medium'>PayLibre · United Bank of Africa</p>
              <p className='text-xs text-xental-text-primary-400'>123456789</p>
            </div>
          </div>
          {withdrawAmount && (
            <div className={cn('rounded-lg px-3 py-2.5 text-xs', Number(withdrawAmount) > 250000 ? 'bg-red-50 text-destructive' : 'bg-xental-bg text-xental-text-primary-500')}>
              {Number(withdrawAmount) > 250000
                ? 'Insufficient balance. Available: ₦250,000'
                : <>You will withdraw <span className='font-semibold text-foreground'>{fmt(withdrawAmount)}</span>. Available: ₦250,000</>}
            </div>
          )}
          <div className='flex gap-2 mt-1'>
            <Button variant='outline' className='flex-1' onClick={() => { setWithdrawOpen(false); setWithdrawAmount(''); }}>Cancel</Button>
            <Button className='flex-1' onClick={handleWithdraw} disabled={!withdrawAmount || Number(withdrawAmount) > 250000 || loading}>
              {loading ? 'Processing…' : 'Confirm Withdrawal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
