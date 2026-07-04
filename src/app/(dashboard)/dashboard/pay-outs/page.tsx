'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle, Download, Search, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useTransactions } from '@/api/dashboard';
import type { TransactionResponse } from '@/api/types/dashboard';

const STATUS_STYLES: Record<string, string> = {
  Successful: 'text-success',
  Failed: 'text-destructive',
  Pending: 'text-pending',
};

const PAGE_SIZE = 8;

export default function PayOutsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: transactions = [], isLoading } = useTransactions();

  const filtered = useMemo(() => {
    return transactions.filter((tx: TransactionResponse) => {
      const matchSearch = !search ||
        (tx.reference ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (tx.transferName ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || tx.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const successful = transactions.filter((t: TransactionResponse) => t.status === 'Successful').length;
  const failed = transactions.filter((t: TransactionResponse) => t.status === 'Failed').length;

  const reset = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Pay-outs</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>Track all outgoing payments</p>
        </div>
        <Button size='sm' variant='outline' className='gap-1.5' onClick={() => toast.info('Export coming soon')}>
          <Download className='w-3.5 h-3.5' /> Export
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard label='Total Pay-outs' value={String(transactions.length)} trend='up' trendValue='' icon={ArrowUpRight} iconColor='text-action-blue' />
        <StatCard label='Successful' value={String(successful)} trend='up' trendValue='' icon={CheckCircle} iconColor='text-success' />
        <StatCard label='Failed' value={String(failed)} trend='down' trendValue='' icon={XCircle} iconColor='text-destructive' />
      </div>

      <div className='bg-white rounded-xl border border-stroke-2'>
        <div className='flex items-center justify-between px-4 py-3 border-b border-stroke-2'>
          <div className='relative'>
            <Search className='w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-xental-text-primary-400' />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder='Search by REF or name...'
              className='pl-8 pr-3 py-1.5 text-xs border border-stroke-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue w-52'
            />
          </div>
          <div className='flex items-center gap-2'>
            <FilterDropdown label='Status' options={['Successful', 'Failed', 'Pending']} value={statusFilter} onChange={reset(setStatusFilter)} />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-8'><input type='checkbox' className='accent-action-blue' /></th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Reference</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Name</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Amount</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Dedicated Account</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='border-b border-stroke-2'>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className='px-4 py-3'><div className='h-3 bg-xental-bg rounded animate-pulse w-20' /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className='px-4 py-10 text-center text-xental-text-primary-400'>No transactions found</td></tr>
              ) : (paginated as TransactionResponse[]).map((tx) => (
                <tr key={tx.id} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors'>
                  <td className='px-4 py-3'><input type='checkbox' className='accent-action-blue' /></td>
                  <td className='px-4 py-3'>
                    <Link href={`/dashboard/pay-outs/${tx.reference}`} className='font-mono text-action-blue hover:underline font-medium'>{tx.reference ?? '—'}</Link>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                        {(tx.transferName ?? 'T').charAt(0).toUpperCase()}
                      </div>
                      <span className='text-foreground font-medium'>{tx.transferName ?? '—'}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-foreground font-medium'>{koboToNaira(tx.amountKobo)}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>{tx.virtualAccountId ?? '—'}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>{formatDate(tx.occurredAtUtc)}</td>
                  <td className='px-4 py-3'><span className={cn('font-medium', STATUS_STYLES[tx.status ?? ''] ?? 'text-xental-text-primary-400')}>{tx.status ?? '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex items-center justify-between px-4 py-3 border-t border-stroke-2'>
          <span className='text-xs text-xental-text-primary-400'>{filtered.length} total</span>
          <div className='flex items-center gap-2'>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40'>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={cn('w-6 h-6 rounded text-xs font-medium transition-colors', p === page ? 'bg-action-blue text-white' : 'text-xental-text-primary-500 hover:bg-xental-bg')}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40'>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
