'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminOnboardingQueue } from '@/api/admin';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 10;

export default function OnboardingView() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data: queue = [], isLoading } = useAdminOnboardingQueue(statusFilter);

  const totalPages = Math.max(1, Math.ceil(queue.length / PAGE_SIZE));
  const paginated = queue.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Onboarding Queue</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Review KYC/KYB applications from prospective merchants.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <FilterDropdown
            label='Status'
            options={[
              { label: 'Under Review', value: 'UnderReview' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Rejected', value: 'Rejected' },
              { label: 'Info Requested', value: 'InfoRequested' },
            ]}
            value={statusFilter}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className='rounded-2xl border border-stroke-2 bg-white flex flex-col'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>Tenant</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>Submission Date</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>Tier</th>
                <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-[25%]'>KYC/KYB Status</th>
                <th className='text-right px-4 py-3 font-medium text-xental-text-primary-400 w-24'>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className='border-b border-stroke-2'>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className='px-4 py-3'>
                        <div className='h-3 bg-xental-bg rounded animate-pulse w-20' />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-4 py-10 text-center text-xental-text-primary-400'>
                    No applications found in the queue.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.tenantId}
                    className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg/50 transition-colors'
                  >
                    <td className='px-4 py-3 w-[25%]'>
                      <div className='flex flex-col'>
                        <Link
                          href={`/admin/onboarding/${item.tenantId}`}
                          className='text-foreground hover:text-action-blue font-medium truncate max-w-[200px]'
                          title={item.tenantId}
                        >
                          {item.tenantId.substring(0, 8)}...
                        </Link>
                        <span className='text-[10px] text-xental-text-primary-400'>{item.tenantEmail}</span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-xental-text-primary-400 w-[25%]'>
                      {new Date(item.submittedAtUtc).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-3 w-[25%]'>
                      <span className='capitalize'>{item.tier}</span>
                    </td>
                    <td className='px-4 py-3 w-[25%]'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-semibold text-muted w-8'>KYC:</span>
                          <StatusBadge status={item.developerKycStatus} />
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-semibold text-muted w-8'>KYB:</span>
                          <StatusBadge status={item.businessKybStatus} />
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <Link
                        href={`/admin/onboarding/${item.tenantId}`}
                        className='text-action-blue hover:underline font-medium'
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='py-4'>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={queue.length}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
