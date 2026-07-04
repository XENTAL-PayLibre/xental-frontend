'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Download, MoreVertical, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn, formatDate } from '@/lib/utils';
import { useSubMerchants } from '@/api/dashboard';
import type { SubMerchantResponse } from '@/api/types/dashboard';

const STATUS_STYLES: Record<string, string> = {
  Active: 'text-success',
  Inactive: 'text-xental-text-primary-400',
};

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data: subMerchants = [], isLoading } = useSubMerchants();

  const filtered = useMemo(() => {
    return subMerchants.filter((c: SubMerchantResponse) => {
      const matchSearch = !search ||
        (c.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.reference ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subMerchants, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Customers</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>Manage your customers and their dedicated accounts</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline' className='gap-1.5' onClick={() => toast.info('Export coming soon')}>
            <Download className='w-3.5 h-3.5' /> Export
          </Button>
          <Button size='sm' className='gap-1.5' onClick={() => toast.info('Add customer coming soon')}>
            <UserPlus className='w-3.5 h-3.5' /> Add customer
          </Button>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-stroke-2'>
        {/* Toolbar */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-stroke-2'>
          <div className='relative'>
            <Search className='w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-xental-text-primary-400' />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder='Search by name or account...'
              className='pl-8 pr-3 py-1.5 text-xs border border-stroke-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue w-56'
            />
          </div>
          <div className='flex items-center gap-2'>
            <FilterDropdown label='Status' options={['Active', 'Inactive']} value={statusFilter} onChange={handleFilterChange(setStatusFilter)} />
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-8'>
                  <input type='checkbox' className='accent-action-blue' />
                </th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Name</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Phone</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Dedicated Account</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date Created</th>
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
                <tr>
                  <td colSpan={7} className='px-4 py-10 text-center text-xental-text-primary-400'>No customers found</td>
                </tr>
              ) : (paginated as SubMerchantResponse[]).map((c) => (
                <tr key={c.id} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors'>
                  <td className='px-4 py-3'><input type='checkbox' className='accent-action-blue' /></td>
                  <td className='px-4 py-3'>
                    <Link href={`/dashboard/customers/${c.id}`} className='flex items-center gap-2 hover:opacity-80'>
                      <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                        {(c.name ?? 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className='font-medium text-foreground'>{c.name ?? '—'}</p>
                        <p className='text-xental-text-primary-400 font-mono text-[10px]'>{c.reference ?? '—'}</p>
                      </div>
                    </Link>
                  </td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>—</td>
                  <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>{c.reference ?? '—'}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>{formatDate(c.createdAtUtc)}</td>
                  <td className='px-4 py-3'>
                    <span className={cn('font-medium', STATUS_STYLES[c.status ?? ''] ?? 'text-xental-text-primary-400')}>{c.status ?? '—'}</span>
                  </td>
                  <td className='px-4 py-3'>
                    <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 cursor-pointer' />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-stroke-2'>
          <span className='text-xs text-xental-text-primary-400'>{filtered.length} total</span>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40'
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-6 h-6 rounded text-xs font-medium transition-colors',
                  p === page ? 'bg-action-blue text-white' : 'text-xental-text-primary-500 hover:bg-xental-bg'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='text-xs text-xental-text-primary-400 hover:text-foreground disabled:opacity-40'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
