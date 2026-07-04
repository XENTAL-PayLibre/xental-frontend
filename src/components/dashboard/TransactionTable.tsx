'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import FilterDropdown from './FilterDropdown';
import { useTransactions } from '@/api/dashboard';
import type { TransactionResponse } from '@/api/types/dashboard';

const STATUS_STYLES: Record<string, string> = {
  Successful: 'text-success',
  Failed: 'text-destructive',
  Pending: 'text-pending',
};

const PAGE_SIZE = 8;

export default function TransactionTable({ title = 'Recent transactions' }: { title?: string }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: transactions = [], isLoading } = useTransactions();

  const filtered = useMemo(() => {
    return transactions.filter((tx: TransactionResponse) => {
      const matchStatus = !statusFilter || tx.status === statusFilter;
      return matchStatus;
    });
  }, [transactions, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  return (
    <div className='bg-white rounded-xl border border-stroke-2'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-stroke-2'>
        <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
        <div className='flex items-center gap-2'>
          <FilterDropdown label='Type' options={['Pay-in', 'Pay-out']} value={typeFilter} onChange={resetPage(setTypeFilter)} />
          <FilterDropdown label='Status' options={['Successful', 'Failed', 'Pending']} value={statusFilter} onChange={resetPage(setStatusFilter)} />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr className='border-b border-stroke-2'>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-8'><input type='checkbox' className='accent-action-blue' /></th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Sender</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Amount</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Reference</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
              <th className='px-4 py-3' />
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
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                      {(tx.transferName ?? 'T').charAt(0).toUpperCase()}
                    </div>
                    <span className='text-foreground font-medium'>{tx.transferName ?? 'Unknown'}</span>
                  </div>
                </td>
                <td className='px-4 py-3 text-foreground font-medium'>{koboToNaira(tx.amountKobo)}</td>
                <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>{tx.reference ?? '—'}</td>
                <td className='px-4 py-3 text-xental-text-primary-500'>{formatDate(tx.occurredAtUtc)}</td>
                <td className='px-4 py-3'>
                  <span className={cn('font-medium', STATUS_STYLES[tx.status ?? ''] ?? 'text-xental-text-primary-400')}>
                    {tx.status ?? '—'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  {tx.reference ? (
                    <Link href={`/dashboard/pay-ins/${tx.reference}`}>
                      <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 cursor-pointer hover:text-foreground' />
                    </Link>
                  ) : (
                    <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400' />
                  )}
                </td>
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
  );
}
