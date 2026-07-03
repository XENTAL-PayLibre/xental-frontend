'use client';

import { useState, useMemo } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import FilterDropdown from './FilterDropdown';

type TxStatus = 'Successful' | 'Failed' | 'Pending';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  dedicatedAccount: string;
  date: string;
  status: TxStatus;
}

const ALL_DATA: Transaction[] = [
  { id: '1', name: 'Chinonso Okeke', amount: '₦30,200', dedicatedAccount: '8061782007', date: '30-04-2026', status: 'Successful' },
  { id: '2', name: 'Amara Nwosu', amount: '₦62,500', dedicatedAccount: '2375849108', date: '01-05-2026', status: 'Successful' },
  { id: '3', name: 'Emeka Obi', amount: '₦15,000', dedicatedAccount: '8061782007', date: '02-05-2026', status: 'Successful' },
  { id: '4', name: 'Fatima Bello', amount: '₦80,750', dedicatedAccount: '4928375610', date: '03-05-2026', status: 'Failed' },
  { id: '5', name: 'Tobi Adeyemi', amount: '₦120,000', dedicatedAccount: '8061782007', date: '05-05-2026', status: 'Failed' },
  { id: '6', name: 'Grace Eze', amount: '₦62,500', dedicatedAccount: '2375849108', date: '06-05-2026', status: 'Successful' },
  { id: '7', name: 'Uche Nnamdi', amount: '₦62,500', dedicatedAccount: '2375849108', date: '07-05-2026', status: 'Successful' },
  { id: '8', name: 'Kemi Afolabi', amount: '₦25,450', dedicatedAccount: '8642097531', date: '08-05-2026', status: 'Failed' },
  { id: '9', name: 'Dayo Ibrahim', amount: '₦90,000', dedicatedAccount: '8061782007', date: '09-05-2026', status: 'Failed' },
  { id: '10', name: 'Ngozi Okonkwo', amount: '₦38,900', dedicatedAccount: '9067123458', date: '10-05-2026', status: 'Pending' },
  { id: '11', name: 'Bola Tinubu', amount: '₦55,000', dedicatedAccount: '1234567890', date: '11-05-2026', status: 'Successful' },
  { id: '12', name: 'Chidi Eze', amount: '₦18,500', dedicatedAccount: '2345678901', date: '12-05-2026', status: 'Pending' },
];

const STATUS_STYLES: Record<TxStatus, string> = {
  Successful: 'text-success',
  Failed: 'text-destructive',
  Pending: 'text-pending',
};

const PAGE_SIZE = 8;

export default function TransactionTable({ title = 'Recent transactions' }: { title?: string }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_DATA.filter((tx) => !statusFilter || tx.status === statusFilter);
  }, [statusFilter, typeFilter]);

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
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Name</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Amount</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Dedicated Account</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
              <th className='px-4 py-3' />
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} className='px-4 py-10 text-center text-xental-text-primary-400'>No transactions match your filters</td></tr>
            ) : paginated.map((tx) => (
              <tr key={tx.id} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors'>
                <td className='px-4 py-3'><input type='checkbox' className='accent-action-blue' /></td>
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
                <td className='px-4 py-3'><MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 cursor-pointer' /></td>
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
