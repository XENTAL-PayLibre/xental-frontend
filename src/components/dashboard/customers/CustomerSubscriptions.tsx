'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import {
  useBillingSchedules,
  useCreateBillingSchedule,
  usePauseSchedule,
  useResumeSchedule,
  useCancelSchedule,
} from '@/api/billing';

const INTERVALS = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-50 text-success',
  Paused: 'bg-orange-50 text-pending',
  Cancelled: 'bg-red-50 text-destructive',
};

export function CustomerSubscriptions({ accountRef }: { accountRef: string }) {
  const { data: all = [], isLoading } = useBillingSchedules();
  const create = useCreateBillingSchedule();
  const pause = usePauseSchedule();
  const resume = useResumeSchedule();
  const cancel = useCancelSchedule();

  const schedules = all.filter((s) => s.accountRef === accountRef);

  const [showForm, setShowForm] = useState(false);
  const [interval, setInterval] = useState('Monthly');
  const [amount, setAmount] = useState('');
  const [dueOffsetDays, setDueOffsetDays] = useState('0');
  const [description, setDescription] = useState('');

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  const handleCreate = () => {
    const naira = parseFloat(amount);
    if (!naira || naira <= 0) return;
    create.mutate(
      {
        accountRef,
        interval,
        amountKobo: Math.round(naira * 100),
        dueOffsetDays: parseInt(dueOffsetDays) || 0,
        ...(description ? { description } : {}),
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setAmount('');
          setDescription('');
        },
      }
    );
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-between gap-4'>
        <h3 className='text-sm font-semibold text-foreground'>Recurring billing</h3>
        <Button size='sm' className='gap-1.5 px-4 h-8 bg-action-blue hover:bg-action-blue/90' onClick={() => setShowForm((v) => !v)}>
          <Plus className='w-3.5 h-3.5' /> New schedule
        </Button>
      </div>

      {showForm && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-stroke-2 p-4'>
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
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Due offset (days)</label>
            <input type='number' min='0' value={dueOffsetDays} onChange={(e) => setDueOffsetDays(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Description (optional)</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Monthly plan' className={inputClass} />
          </div>
          <div className='sm:col-span-2 flex justify-end gap-2'>
            <Button type='button' variant='outline' size='sm' onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type='button' size='sm' onClick={handleCreate} disabled={create.isPending}>
              {create.isPending ? 'Creating...' : 'Create schedule'}
            </Button>
          </div>
        </div>
      )}

      <div className='overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr className='border-b border-stroke-2'>
              <th className='text-left px-4 py-3 font-semibold text-foreground'>Interval</th>
              <th className='text-left px-4 py-3 font-semibold text-foreground'>Next amount</th>
              <th className='text-left px-4 py-3 font-semibold text-foreground'>Periods</th>
              <th className='text-left px-4 py-3 font-semibold text-foreground'>Next due</th>
              <th className='text-left px-4 py-3 font-semibold text-foreground'>Status</th>
              <th className='text-right px-4 py-3 font-semibold text-foreground'>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className='py-8 text-center text-xental-text-primary-400'>Loading schedules...</td></tr>
            ) : schedules.length === 0 ? (
              <tr><td colSpan={6} className='py-8 text-center text-xental-text-primary-400'>No recurring schedules for this customer</td></tr>
            ) : (
              schedules.map((s) => (
                <tr key={s.id} className='border-b border-stroke-2/50 last:border-0'>
                  <td className='px-4 py-3.5 text-foreground font-medium'>{s.interval}</td>
                  <td className='px-4 py-3.5 text-xental-text-primary-500'>{koboToNaira(s.nextAmountKobo)}</td>
                  <td className='px-4 py-3.5 text-xental-text-primary-500'>{s.periodsGenerated}</td>
                  <td className='px-4 py-3.5 text-xental-text-primary-500'>
                    {s.currentPeriodEndUtc ? formatDate(s.currentPeriodEndUtc) : '—'}
                  </td>
                  <td className='px-4 py-3.5'>
                    <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium', STATUS_BADGE[s.status] ?? 'bg-gray-50 text-gray-500')}>
                      {s.status}
                    </span>
                  </td>
                  <td className='px-4 py-3.5 text-right'>
                    <div className='inline-flex items-center gap-3'>
                      {s.status === 'Active' && (
                        <button type='button' onClick={() => pause.mutate(s.id)} disabled={pause.isPending} className='text-[11px] font-medium text-pending hover:opacity-80'>
                          Pause
                        </button>
                      )}
                      {s.status === 'Paused' && (
                        <button type='button' onClick={() => resume.mutate(s.id)} disabled={resume.isPending} className='text-[11px] font-medium text-success hover:opacity-80'>
                          Resume
                        </button>
                      )}
                      {s.status !== 'Cancelled' && (
                        <button type='button' onClick={() => window.confirm('Cancel this schedule?') && cancel.mutate(s.id)} disabled={cancel.isPending} className='text-[11px] font-medium text-destructive hover:opacity-80'>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
