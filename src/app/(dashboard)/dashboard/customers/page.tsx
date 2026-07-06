'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, MoreVertical, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn, formatDate } from '@/lib/utils';
import { useSubMerchants } from '@/api/dashboard';
import type { SubMerchantResponse } from '@/api/types/dashboard';

import Modal from '@/components/ui/Modal';
import { useCreateVirtualAccount } from '@/api/virtual-accounts';

const STATUS_STYLES: Record<string, string> = {
  Active: 'text-success',
  Inactive: 'text-xental-text-primary-400',
};

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    accountRef: '',
    name: '',
    email: '',
    phone: '',
    expectedAmountKobo: 0,
    expiryDateUtc: '',
    subMerchantRef: '',
  });

  const { data: subMerchants = [], isLoading } = useSubMerchants();
  const createCustomer = useCreateVirtualAccount();

  const handleCreateCustomer = () => {
    if (!newCustomer.accountRef || !newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    createCustomer.mutate(
      {
        accountRef: newCustomer.accountRef,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        expectedAmountKobo: newCustomer.expectedAmountKobo,
        expiryDateUtc: newCustomer.expiryDateUtc || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        ...(newCustomer.subMerchantRef ? { subMerchantRef: newCustomer.subMerchantRef } : {}),
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewCustomer({
            accountRef: '',
            name: '',
            email: '',
            phone: '',
            expectedAmountKobo: 0,
            expiryDateUtc: '',
            subMerchantRef: '',
          });
        },
      }
    );
  };


  const filtered = useMemo(() => {
    return subMerchants.filter((c: SubMerchantResponse) => {
      const matchSearch =
        !search ||
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
            variant='outline'
            className='gap-1.5'
            onClick={() => toast.info('Export coming soon')}
          >
            <Download className='w-3.5 h-3.5' /> Export
          </Button>
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
            <FilterDropdown
              label='Status'
              options={['Active', 'Inactive']}
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
            />
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
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>
                  Name
                </th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>
                  Email
                </th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>
                  Dedicated Account
                </th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[120px]'>
                  Status
                </th>
                <th className='p py-3 w-8' />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='border-b border-stroke-2'>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className='px-4 py-3'>
                        <div className='h-3 bg-xental-bg rounded animate-pulse w-20' />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className='px-4 py-10 text-center text-xental-text-primary-400'
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                (paginated as SubMerchantResponse[]).map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/dashboard/customers/${c.id}`)}
                    className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors cursor-pointer'
                  >
                    <td className='px-4 py-3' onClick={(e) => e.stopPropagation()}>
                      <input type='checkbox' className='accent-action-blue' />
                    </td>
                    <td className='px-4 py-3'>
                      <Link
                        href={`/dashboard/customers/${c.id}`}
                        className='flex items-center gap-2 hover:opacity-80'
                      >
                        <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                          {(c.name ?? 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className='font-medium text-foreground'>
                            {c.name ?? '—'}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className='px-4 py-3 text-xental-text-primary-500'>
                      {(c as any).email ?? '—'}
                    </td>
                    <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>
                      {c.reference ?? '—'}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={cn(
                          'font-medium',
                          STATUS_STYLES[c.status ?? ''] ??
                            'text-xental-text-primary-400'
                        )}
                      >
                        {c.status ?? 'N/A'}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 cursor-pointer inline-block' />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t border-stroke-2'>
          <span className='text-xs text-xental-text-primary-400'>
            {filtered.length} total
          </span>
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
                  p === page
                    ? 'bg-action-blue text-white'
                    : 'text-xental-text-primary-500 hover:bg-xental-bg'
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

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Create Customer (Virtual Account)'
        className='max-w-lg'
      >
        <div className='space-y-4 mt-2'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Account Reference <span className='text-destructive'>*</span>
              </label>
              <input
                value={newCustomer.accountRef}
                onChange={(e) => setNewCustomer({ ...newCustomer, accountRef: e.target.value })}
                placeholder='CUST-123'
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Full Name <span className='text-destructive'>*</span>
              </label>
              <input
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder='John Doe'
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Email <span className='text-destructive'>*</span>
              </label>
              <input
                type='email'
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder='john@example.com'
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Phone <span className='text-destructive'>*</span>
              </label>
              <input
                type='tel'
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder='+234...'
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Expected Amount (Kobo)
              </label>
              <input
                type='number'
                value={newCustomer.expectedAmountKobo || ''}
                onChange={(e) => setNewCustomer({ ...newCustomer, expectedAmountKobo: parseInt(e.target.value) || 0 })}
                placeholder='0'
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>
                Expiry Date
              </label>
              <input
                type='datetime-local'
                value={newCustomer.expiryDateUtc ? newCustomer.expiryDateUtc.slice(0, 16) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setNewCustomer({ ...newCustomer, expiryDateUtc: '' });
                    return;
                  }
                  try {
                    const d = new Date(val);
                    if (!isNaN(d.getTime())) {
                      setNewCustomer({ ...newCustomer, expiryDateUtc: d.toISOString() });
                    }
                  } catch (err) {}
                }}
                className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
              />
            </div>
          </div>

          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>
              Sub-Merchant Reference (Optional)
            </label>
            <input
              value={newCustomer.subMerchantRef}
              onChange={(e) => setNewCustomer({ ...newCustomer, subMerchantRef: e.target.value })}
              placeholder='SUB-MERCH-456'
              className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue'
            />
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              variant='outline'
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={createCustomer.isPending}
            >
              {createCustomer.isPending ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
