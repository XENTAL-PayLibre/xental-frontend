'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle, Download, Search, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn } from '@/lib/utils';

type TxStatus = 'Successful' | 'Failed' | 'Pending';

interface PayOut {
  ref: string;
  name: string;
  amount: string;
  dedicatedAccount: string;
  date: string;
  status: TxStatus;
}

const ALL_DATA: PayOut[] = [
  { ref: 'OUT202001', name: 'Chinonso Okeke', amount: '₦25,000', dedicatedAccount: '8061782007', date: '26 Jun 2026', status: 'Successful' },
  { ref: 'OUT202002', name: 'Amara Nwosu', amount: '₦18,500', dedicatedAccount: '2375849108', date: '24 Jun 2026', status: 'Successful' },
  { ref: 'OUT202003', name: 'Emeka Obi', amount: '₦10,000', dedicatedAccount: '8061782008', date: '22 Jun 2026', status: 'Pending' },
  { ref: 'OUT202004', name: 'Fatima Bello', amount: '₦45,000', dedicatedAccount: '4928375610', date: '20 Jun 2026', status: 'Failed' },
  { ref: 'OUT202005', name: 'Tobi Adeyemi', amount: '₦70,000', dedicatedAccount: '7312456890', date: '18 Jun 2026', status: 'Successful' },
  { ref: 'OUT202006', name: 'Grace Eze', amount: '₦32,500', dedicatedAccount: '2375849109', date: '16 Jun 2026', status: 'Successful' },
  { ref: 'OUT202007', name: 'Uche Nnamdi', amount: '₦15,000', dedicatedAccount: '9087654321', date: '14 Jun 2026', status: 'Failed' },
  { ref: 'OUT202008', name: 'Kemi Afolabi', amount: '₦50,000', dedicatedAccount: '8642097531', date: '12 Jun 2026', status: 'Successful' },
  { ref: 'OUT202009', name: 'Dayo Ibrahim', amount: '₦28,000', dedicatedAccount: '6789012345', date: '10 Jun 2026', status: 'Successful' },
  { ref: 'OUT202010', name: 'Ngozi Okonkwo', amount: '₦40,000', dedicatedAccount: '9067123458', date: '08 Jun 2026', status: 'Pending' },
  { ref: 'OUT202011', name: 'Bola Tinubu', amount: '₦60,000', dedicatedAccount: '1234567890', date: '06 Jun 2026', status: 'Successful' },
  { ref: 'OUT202012', name: 'Chidi Eze', amount: '₦22,000', dedicatedAccount: '2345678901', date: '04 Jun 2026', status: 'Failed' },
];

const STATUS_STYLES: Record<TxStatus, string> = {
  Successful: 'text-success',
  Failed: 'text-destructive',
  Pending: 'text-pending',
};

const PAGE_SIZE = 8;

export default function PayOutsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_DATA.filter((tx) => {
      const matchSearch = !search || tx.ref.toLowerCase().includes(search.toLowerCase()) || tx.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || tx.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const successful = ALL_DATA.filter((t) => t.status === 'Successful').length;
  const failed = ALL_DATA.filter((t) => t.status === 'Failed').length;

  const reset = (setter: (v: string) => void) => (v: string) => { setter(v); setPage(1); };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Pay-outs</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>Track all outgoing payments</p>
        </div>
        <Button size='sm' variant='outline' className='gap-1.5' onClick={() => toast.info('Export coming soon — wire to API first')}>
          <Download className='w-3.5 h-3.5' /> Export
        </Button>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <StatCard label='Total Pay-outs' value='₦250,000' trend='up' trendValue='10%' icon={ArrowUpRight} iconColor='text-action-blue' />
        <StatCard label='Successful' value={String(successful)} trend='up' trendValue='5%' icon={CheckCircle} iconColor='text-success' />
        <StatCard label='Failed' value={String(failed)} trend='down' trendValue='1%' icon={XCircle} iconColor='text-destructive' />
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
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className='px-4 py-10 text-center text-xental-text-primary-400'>No transactions found</td></tr>
              ) : paginated.map((tx) => (
                <tr key={tx.ref} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors'>
                  <td className='px-4 py-3'><input type='checkbox' className='accent-action-blue' /></td>
                  <td className='px-4 py-3'>
                    <Link href={`/dashboard/pay-outs/${tx.ref}`} className='font-mono text-action-blue hover:underline font-medium'>{tx.ref}</Link>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>{tx.name.charAt(0)}</div>
                      <span className='text-foreground font-medium'>{tx.name}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-foreground font-medium'>{tx.amount}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>{tx.dedicatedAccount}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>{tx.date}</td>
                  <td className='px-4 py-3'><span className={cn('font-medium', STATUS_STYLES[tx.status])}>{tx.status}</span></td>
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
