'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, MoreVertical, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn, formatDate } from '@/lib/utils';
import type { VirtualAccountResponse } from '@/api/types/dashboard';

import { useVirtualAccountsList } from '@/api/virtual-accounts';
import { useSubMerchantsList } from '@/api/sub-merchants';
import { CustomersTable } from '@/components/dashboard/customers/CustomersTable';
import { CreateCustomerModal } from '@/components/dashboard/customers/CreateCustomerModal';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 8;

// Read the initial sub-merchant filter from the URL (?subMerchant=ref) on the client.
const initialSubMerchant = () =>
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('subMerchant') ?? '' : '';

export function CustomersView() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subMerchantFilter, setSubMerchantFilter] = useState(initialSubMerchant);
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: subMerchants = [] } = useSubMerchantsList();
  const { data: virtualAccounts = [], isLoading } = useVirtualAccountsList(subMerchantFilter || undefined);


  const filtered = useMemo(() => {
    return virtualAccounts.filter((c: VirtualAccountResponse) => {
      const matchSearch =
        !search ||
        (c.accountName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.accountRef ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [virtualAccounts, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        <div>
          <h1 className='text-xl font-bold text-foreground'>Customers</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            View and manage customer information, fees, and payment activity.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Button
            size='sm'
            className='gap-1.5'
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus className='w-3.5 h-3.5' /> Add customer
          </Button>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-stroke-2'>
        {/* Toolbar */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-stroke-2'>
          <div className='relative w-full sm:w-auto'>
            <Search className='w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-xental-text-primary-400' />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder='Search by name or ID'
              className='pl-8 pr-3 py-1.5 text-xs border border-stroke-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue w-full sm:w-56'
            />
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
            {subMerchants.length > 0 && (
              <select
                value={subMerchantFilter}
                onChange={(e) => { setSubMerchantFilter(e.target.value); setPage(1); }}
                className='px-2.5 py-1.5 text-xs border border-stroke-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
              >
                <option value=''>All sub-merchants</option>
                {subMerchants.map((sm) => (
                  <option key={sm.id} value={sm.reference ?? ''}>{sm.name}</option>
                ))}
              </select>
            )}
            <FilterDropdown
              label='Status'
              options={['Active', 'Inactive']}
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
            />
          </div>
        </div>

        {/* Table */}
        <CustomersTable data={paginated as VirtualAccountResponse[]} isLoading={isLoading} />

        {/* Pagination */}
        <Pagination 
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          onPageChange={setPage}
        />
      </div>

      <CreateCustomerModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
