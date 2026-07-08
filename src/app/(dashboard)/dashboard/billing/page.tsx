'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import {
  useBillingSchedules,
  usePauseSchedule,
  useResumeSchedule,
  useCancelSchedule,
} from '@/api/billing';
import { CreateScheduleModal } from '@/components/dashboard/billing/CreateScheduleModal';

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-50 text-success',
  Paused: 'bg-orange-50 text-pending',
  Cancelled: 'bg-red-50 text-destructive',
};

export default function BillingPage() {
  const { data: schedules = [], isLoading } = useBillingSchedules();
  const pause = usePauseSchedule();
  const resume = useResumeSchedule();
  const cancel = useCancelSchedule();
  const [open, setOpen] = useState(false);

  const active = schedules.filter((s) => s.status === 'Active');
  const paused = schedules.filter((s) => s.status === 'Paused').length;
  const recurringNaira = active.reduce((sum, s) => sum + s.nextAmountKobo, 0);

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div>
          <h1 className='text-[22px] font-bold text-foreground'>Billing</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Recurring billing schedules across your customers
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className='gap-1.5 bg-action-blue hover:bg-action-blue/90'>
          <Plus className='w-4 h-4' /> New schedule
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard label='Active schedules' value={String(active.length)} icon='/images/dashboard/pay-in.svg' />
        <StatCard label='Next-cycle value' value={koboToNaira(recurringNaira)} icon='/images/dashboard/successful.svg' />
        <StatCard label='Paused' value={String(paused)} icon='/images/dashboard/failed.svg' />
      </div>

      <div className='bg-white rounded-[12px] px-4 py-4 flex-1'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Customer</th>
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
                <tr><td colSpan={7} className='py-10 text-center text-xental-text-primary-400'>Loading schedules...</td></tr>
              ) : schedules.length === 0 ? (
                <tr><td colSpan={7} className='py-10 text-center text-xental-text-primary-400'>No billing schedules yet</td></tr>
              ) : (
                schedules.map((s) => (
                  <tr key={s.id} className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'>
                    <td className='px-4 py-3.5 text-xental-text-primary-500 font-medium'>{s.accountRef}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{s.interval}</td>
                    <td className='px-4 py-3.5 text-foreground font-medium'>{koboToNaira(s.nextAmountKobo)}</td>
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
                          <button type='button' onClick={() => pause.mutate(s.id)} disabled={pause.isPending} className='text-[11px] font-medium text-pending hover:opacity-80'>Pause</button>
                        )}
                        {s.status === 'Paused' && (
                          <button type='button' onClick={() => resume.mutate(s.id)} disabled={resume.isPending} className='text-[11px] font-medium text-success hover:opacity-80'>Resume</button>
                        )}
                        {s.status !== 'Cancelled' && (
                          <button type='button' onClick={() => window.confirm('Cancel this schedule?') && cancel.mutate(s.id)} disabled={cancel.isPending} className='text-[11px] font-medium text-destructive hover:opacity-80'>Cancel</button>
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

      <CreateScheduleModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
