'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useCreateBillingSchedule } from '@/api/billing';
import { useVirtualAccountsList } from '@/api/virtual-accounts';

const INTERVALS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

interface CreateScheduleModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-selected customer (when opened from a customer). */
  accountRef?: string;
}

export function CreateScheduleModal({ open, onClose, accountRef: preset }: CreateScheduleModalProps) {
  const create = useCreateBillingSchedule();
  const { data: customers = [] } = useVirtualAccountsList();

  const [accountRef, setAccountRef] = useState(preset ?? '');
  const [interval, setInterval] = useState('Monthly');
  const [amount, setAmount] = useState('');
  const [dueOffsetDays, setDueOffsetDays] = useState('0');
  const [description, setDescription] = useState('');

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  const handleClose = () => {
    setAmount('');
    setDescription('');
    onClose();
  };

  const handleCreate = () => {
    const naira = parseFloat(amount);
    if (!accountRef || !naira || naira <= 0) return;
    create.mutate(
      {
        accountRef,
        interval,
        amountKobo: Math.round(naira * 100),
        dueOffsetDays: parseInt(dueOffsetDays) || 0,
        ...(description ? { description } : {}),
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title='New billing schedule' className='max-w-lg'>
      <div className='mt-2 space-y-4'>
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Customer</label>
          {preset ? (
            <input value={accountRef} disabled className={inputClass} />
          ) : (
            <select value={accountRef} onChange={(e) => setAccountRef(e.target.value)} className={inputClass}>
              <option value=''>Select a customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.accountRef ?? ''}>
                  {(c.customerName ?? c.accountName ?? 'Customer')} — {c.accountNumber ?? c.accountRef}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Interval</label>
            <select value={interval} onChange={(e) => setInterval(e.target.value)} className={inputClass}>
              {INTERVALS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Amount (₦)</label>
            <input type='number' min='0' step='0.01' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='0' className={inputClass} />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Due offset (days)</label>
            <input type='number' min='0' value={dueOffsetDays} onChange={(e) => setDueOffsetDays(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Description (optional)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Monthly plan' className={inputClass} />
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-1'>
          <Button type='button' variant='outline' onClick={handleClose}>Cancel</Button>
          <Button type='button' onClick={handleCreate} disabled={create.isPending || !accountRef}>
            {create.isPending ? 'Creating...' : 'Create schedule'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
