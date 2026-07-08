'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { VirtualAccountResponse } from '@/api/types/dashboard';

interface CustomersTableProps {
  data: VirtualAccountResponse[];
  isLoading: boolean;
}

export function CustomersTable({ data, isLoading }: CustomersTableProps) {
  const router = useRouter();

  return (
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
            <th className='px-4 py-3 w-8' />
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
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className='px-4 py-10 text-center text-xental-text-primary-400'
              >
                No customers found
              </td>
            </tr>
          ) : (
            data.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/dashboard/customers/${c.accountRef}`)}
                className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg transition-colors cursor-pointer'
              >
                <td className='px-4 py-3' onClick={(e) => e.stopPropagation()}>
                  <input type='checkbox' className='accent-action-blue' />
                </td>
                <td className='px-4 py-3'>
                  <Link
                    href={`/dashboard/customers/${c.accountRef}`}
                    className='flex items-center gap-2 hover:opacity-80'
                  >
                    <div className='w-6 h-6 rounded-full bg-xental-blue-100 flex items-center justify-center text-[10px] font-bold text-action-blue shrink-0'>
                      {(c.customerName ?? c.accountName ?? 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='font-medium text-foreground'>
                        {c.customerName ?? c.accountName ?? '—'}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className='px-4 py-3 text-xental-text-primary-500'>
                  {c.customerEmail ?? '—'}
                </td>
                <td className='px-4 py-3 text-xental-text-primary-500 font-mono'>
                  {c.accountNumber ?? '—'}
                </td>
                <td className='px-4 py-3'>
                  <StatusBadge status={c.status === 'Active' ? 'Verified' : 'N/A'} />
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
  );
}
