'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Download, MoreVertical, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { cn } from '@/lib/utils';

type CustomerStatus = 'Active' | 'Inactive';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dedicatedAccount: string;
  dateCreated: string;
  status: CustomerStatus;
}

const ALL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Chinonso Okeke', email: 'chinonso@mail.com', phone: '+234 803 456 7890', dedicatedAccount: '8061782007', dateCreated: '30-04-2026', status: 'Active' },
  { id: '2', name: 'Amara Nwosu', email: 'amara@mail.com', phone: '+234 802 345 6789', dedicatedAccount: '2375849108', dateCreated: '01-05-2026', status: 'Active' },
  { id: '3', name: 'Emeka Obi', email: 'emeka@mail.com', phone: '+234 901 234 5678', dedicatedAccount: '8061782008', dateCreated: '02-05-2026', status: 'Inactive' },
  { id: '4', name: 'Fatima Bello', email: 'fatima@mail.com', phone: '+234 800 123 4567', dedicatedAccount: '4928375610', dateCreated: '03-05-2026', status: 'Active' },
  { id: '5', name: 'Tobi Adeyemi', email: 'tobi@mail.com', phone: '+234 809 876 5432', dedicatedAccount: '7312456890', dateCreated: '05-05-2026', status: 'Active' },
  { id: '6', name: 'Grace Eze', email: 'grace@mail.com', phone: '+234 806 543 2109', dedicatedAccount: '2375849109', dateCreated: '06-05-2026', status: 'Active' },
  { id: '7', name: 'Uche Nnamdi', email: 'uche@mail.com', phone: '+234 812 678 9012', dedicatedAccount: '9087654321', dateCreated: '07-05-2026', status: 'Inactive' },
  { id: '8', name: 'Kemi Afolabi', email: 'kemi@mail.com', phone: '+234 815 901 2345', dedicatedAccount: '8642097531', dateCreated: '08-05-2026', status: 'Active' },
  { id: '9', name: 'Dayo Ibrahim', email: 'dayo@mail.com', phone: '+234 703 234 5678', dedicatedAccount: '6789012345', dateCreated: '09-05-2026', status: 'Active' },
  { id: '10', name: 'Ngozi Okonkwo', email: 'ngozi@mail.com', phone: '+234 706 789 0123', dedicatedAccount: '9067123458', dateCreated: '10-05-2026', status: 'Active' },
  { id: '11', name: 'Bola Tinubu', email: 'bola@mail.com', phone: '+234 801 111 2222', dedicatedAccount: '1234567890', dateCreated: '11-05-2026', status: 'Active' },
  { id: '12', name: 'Chidi Eze', email: 'chidi@mail.com', phone: '+234 802 222 3333', dedicatedAccount: '2345678901', dateCreated: '12-05-2026', status: 'Inactive' },
];

const STATUS_STYLES: Record<CustomerStatus, string> = {
  Active: 'text-success',
  Inactive: 'text-xental-text-primary-400',
};

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_CUSTOMERS.filter((c) => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dedicatedAccount.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

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
          <Button size='sm' variant='outline' className='gap-1.5' onClick={() => toast.info('Export coming soon — wire to API first')}>
            <Download className='w-3.5 h-3.5' /> Export
          </Button>
          <Button size='sm' className='gap-1.5' onClick={() => toast.info('Add customer — coming once API is wired')}>
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-4 py-10 text-center text-xental-text-primary-400'>No customers found</td>
                </tr>
              ) : paginated.map((c) => (
                <tr key={c.id} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors'>
                  <td className='px-4 py-3'><input type='checkbox' className='accent-action-blue' /></td>
                  <td className='px-4 py-3'>
                    <Link href={`/dashboard/customers/${c.id}`} className='flex items-center gap-2 hover:opacity-80'>
                      <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className='font-medium text-foreground'>{c.name}</p>
                        <p className='text-xental-text-primary-400'>{c.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>{c.phone}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>{c.dedicatedAccount}</td>
                  <td className='px-4 py-3 text-xental-text-primary-500'>{c.dateCreated}</td>
                  <td className='px-4 py-3'>
                    <span className={cn('font-medium', STATUS_STYLES[c.status])}>{c.status}</span>
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
