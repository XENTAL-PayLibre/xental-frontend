'use client';

import { useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useAging, useForecast, useCustomerScores } from '@/api/collections';

const RATING_BADGE: Record<string, string> = {
  Excellent: 'bg-green-50 text-success',
  Good: 'bg-blue-50 text-action-blue',
  Fair: 'bg-orange-50 text-pending',
  Poor: 'bg-red-50 text-destructive',
};
const AGING_BAR: Record<string, string> = {
  '0–7 days': 'bg-success',
  '8–30 days': 'bg-action-blue',
  '31–60 days': 'bg-pending',
  '60+ days': 'bg-destructive',
};
const DAY_OPTIONS = [30, 60, 90];

export default function CollectionsPage() {
  const [days, setDays] = useState(30);
  const { data: aging } = useAging();
  const { data: forecast } = useForecast(days);
  const { data: customers = [], isLoading } = useCustomerScores();

  const atRisk = customers.filter((c) => c.rating === 'Poor').length;
  const agingMax = Math.max(1, ...(aging?.buckets ?? []).map((b) => b.outstandingKobo));
  const weekMax = Math.max(1, ...(forecast?.weeks ?? []).map((w) => w.scheduledKobo));

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div>
        <h1 className='text-[22px] font-bold text-foreground'>Collections</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>
          Receivables aging, cash-flow forecast, and per-customer collection reliability
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard label='Outstanding receivables' value={koboToNaira(aging?.totalOutstandingKobo ?? 0)} icon='/images/dashboard/failed.svg' />
        <StatCard label={`Projected inflow (${days}d)`} value={koboToNaira(forecast?.projectedTotalKobo ?? 0)} icon='/images/dashboard/pay-in.svg' />
        <StatCard label='At-risk customers' value={String(atRisk)} icon='/images/dashboard/successful.svg' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Aging */}
        <div className='bg-white rounded-[12px] px-5 py-5'>
          <h3 className='text-sm font-semibold text-foreground mb-4'>Receivables aging</h3>
          <div className='space-y-3'>
            {(aging?.buckets ?? []).map((b) => (
              <div key={b.label}>
                <div className='flex justify-between text-xs mb-1'>
                  <span className='text-xental-text-primary-500'>{b.label} <span className='text-xental-text-primary-400'>({b.accounts})</span></span>
                  <span className='text-foreground font-medium'>{koboToNaira(b.outstandingKobo)}</span>
                </div>
                <div className='h-2 rounded-full bg-xental-bg overflow-hidden'>
                  <div className={cn('h-full rounded-full', AGING_BAR[b.label] ?? 'bg-action-blue')} style={{ width: `${Math.round((b.outstandingKobo / agingMax) * 100)}%` }} />
                </div>
              </div>
            ))}
            {(!aging || aging.buckets.every((b) => b.outstandingKobo === 0)) && (
              <p className='text-xs text-xental-text-primary-400 py-6 text-center'>No outstanding receivables 🎉</p>
            )}
          </div>
        </div>

        {/* Forecast */}
        <div className='bg-white rounded-[12px] px-5 py-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold text-foreground'>Cash-flow forecast</h3>
            <div className='inline-flex rounded-lg border border-stroke-2 overflow-hidden'>
              {DAY_OPTIONS.map((d) => (
                <button key={d} type='button' onClick={() => setDays(d)}
                  className={cn('px-2.5 py-1 text-[11px] font-medium', days === d ? 'bg-action-blue text-white' : 'text-xental-text-primary-500 hover:bg-xental-bg')}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
          <div className='flex items-end gap-1.5 h-28 mb-3'>
            {(forecast?.weeks ?? []).map((w, i) => (
              <div key={i} className='flex-1 flex flex-col items-center gap-1' title={`${formatDate(w.weekStartUtc)} — ${koboToNaira(w.scheduledKobo)}`}>
                <div className='w-full bg-action-blue-surface rounded-t' style={{ height: `${Math.max(4, Math.round((w.scheduledKobo / weekMax) * 100))}%` }} />
                <span className='text-[9px] text-xental-text-primary-400'>W{i + 1}</span>
              </div>
            ))}
          </div>
          <div className='grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stroke-2'>
            <div className='flex justify-between'><span className='text-xental-text-primary-400'>Scheduled due</span><span className='text-foreground font-medium'>{koboToNaira(forecast?.scheduledDueKobo ?? 0)}</span></div>
            <div className='flex justify-between'><span className='text-xental-text-primary-400'>Run-rate</span><span className='text-foreground font-medium'>{koboToNaira(forecast?.runRateProjectedKobo ?? 0)}</span></div>
          </div>
        </div>
      </div>

      {/* Customer scores */}
      <div className='bg-white rounded-[12px] px-4 py-4 flex-1'>
        <h3 className='text-sm font-semibold text-foreground mb-3 px-1'>Customer collection scores</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs min-w-[720px]'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Customer</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Collection rate</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Outstanding</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Deposits</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Late periods</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Score</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className='py-10 text-center text-xental-text-primary-400'>Loading scores...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className='py-10 text-center text-xental-text-primary-400'>No customers yet</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customerRef} className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'>
                    <td className='px-4 py-3.5'>
                      <p className='text-foreground font-medium'>{c.customerName}</p>
                      <p className='text-[11px] text-xental-text-primary-400'>{c.customerRef}</p>
                    </td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{c.collectionRatePct}%</td>
                    <td className='px-4 py-3.5 text-foreground font-medium'>{koboToNaira(c.outstandingKobo)}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{c.deposits}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{c.latePeriods}/{c.duePeriods}</td>
                    <td className='px-4 py-3.5'>
                      <div className='flex items-center gap-2'>
                        <span className='text-foreground font-semibold w-7'>{c.score}</span>
                        <span className={cn('px-2 py-0.5 rounded-md text-[11px] font-medium', RATING_BADGE[c.rating] ?? 'bg-gray-50 text-gray-500')}>{c.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
