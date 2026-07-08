'use client';

import StatCard from '@/components/dashboard/StatCard';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useTransfers } from '@/api/transfers';

const STATUS_BADGE: Record<string, string> = {
  Completed: 'bg-green-50 text-success',
  Successful: 'bg-green-50 text-success',
  Success: 'bg-green-50 text-success',
  Failed: 'bg-red-50 text-destructive',
  Pending: 'bg-orange-50 text-pending',
  Processing: 'bg-orange-50 text-pending',
};

const isSuccess = (s: string | null) => /success|complete/i.test(s ?? '');
const isFailed = (s: string | null) => /fail/i.test(s ?? '');

export default function PayOutsPage() {
  const { data: transfers = [], isLoading } = useTransfers();

  const total = transfers.reduce((sum, t) => sum + t.amountKobo, 0);
  const successful = transfers.filter((t) => isSuccess(t.status)).length;
  const failed = transfers.filter((t) => isFailed(t.status)).length;

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div>
        <h1 className='text-[22px] font-bold text-foreground'>Pay-outs</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>
          Successful withdrawals to your settlement account
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard label='Total payouts' value={koboToNaira(total)} icon='/images/dashboard/pay-out.svg' />
        <StatCard label='Successful' value={String(successful)} icon='/images/dashboard/successful.svg' />
        <StatCard label='Failed' value={String(failed)} icon='/images/dashboard/failed.svg' />
      </div>

      <div className='bg-white rounded-[12px] px-4 py-4 flex-1'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Reference</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Recipient</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Amount</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Date</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className='py-10 text-center text-xental-text-primary-400'>Loading payouts...</td></tr>
              ) : transfers.length === 0 ? (
                <tr><td colSpan={5} className='py-10 text-center text-xental-text-primary-400'>No payout activity yet</td></tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t.id} className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'>
                    <td className='px-4 py-3.5 text-xental-text-primary-500 font-medium'>{t.merchantTxRef}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500 font-mono'>{t.recipientAccountNumber}</td>
                    <td className='px-4 py-3.5 text-foreground font-medium'>{koboToNaira(t.amountKobo)}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{formatDate(t.createdAtUtc)}</td>
                    <td className='px-4 py-3.5'>
                      <span className={cn('px-2.5 py-1 rounded-md text-[11px] font-medium', STATUS_BADGE[t.status] ?? 'bg-gray-50 text-gray-500')}>
                        {t.status}
                      </span>
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
