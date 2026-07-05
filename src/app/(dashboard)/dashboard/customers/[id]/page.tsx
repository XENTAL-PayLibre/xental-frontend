'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FilterDropdown from '@/components/dashboard/FilterDropdown';

type Tab = 'Recent transactions' | 'Profile';
const TABS: Tab[] = ['Recent transactions', 'Profile'];

type TxStatus = 'Successful' | 'Failed' | 'Pending';

const STATUS_BADGE: Record<TxStatus, string> = {
  Successful: 'bg-green-50 text-success',
  Failed: 'bg-red-50 text-destructive',
  Pending: 'bg-orange-50 text-pending',
};

const MOCK_TRANSACTIONS = [
  {
    ref: 'REF202002',
    date: '2026-02-23',
    amount: '$48,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202002',
    date: '2026-02-23',
    amount: '$48,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202002',
    date: '2026-02-23',
    amount: '$48,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202004',
    date: '2026-02-17',
    amount: '₦45,750',
    status: 'Failed' as TxStatus,
  },
  {
    ref: 'REF202005',
    date: '2026-02-16',
    amount: '₦100,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202005',
    date: '2026-02-16',
    amount: '₦100,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202005',
    date: '2026-02-16',
    amount: '₦100,000',
    status: 'Successful' as TxStatus,
  },
  {
    ref: 'REF202009',
    date: '2026-02-10',
    amount: '₦30,500',
    status: 'Failed' as TxStatus,
  },
  {
    ref: 'REF202009',
    date: '2026-02-10',
    amount: '₦30,500',
    status: 'Failed' as TxStatus,
  },
];

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-sm text-foreground font-semibold'>
        {label}
      </span>
      <span className='text-base text-xental-text-primary-500'>{value}</span>
    </div>
  );
}

export default function CustomerDetailPage() {
  const [tab, setTab] = useState<Tab>('Recent transactions');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <Link
          href='/dashboard/customers'
          className='p-2 -ml-2 rounded-full hover:bg-xental-bg transition-colors flex items-center justify-center'
        >
          <ArrowLeft className='w-5 h-5 text-foreground' />
        </Link>
        <h1 className='text-[22px] font-bold text-foreground'>
          Customer Details
        </h1>
      </div>

      {/* Profile Summary */}
      <div className='bg-white rounded-[12px] px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
        <div className='w-24 h-24 md:w-[120px] md:h-[120px] rounded-full overflow-hidden shrink-0'>
          {/* We'll use a placeholder image for the avatar matching the design */}
          <img
            src='https://i.pravatar.cc/150?u=chinonso'
            alt='Chinonso Okeke'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='flex flex-col items-center md:items-start gap-4 md:gap-3 w-full'>
          <h2 className='text-xl md:text-lg font-semibold text-foreground'>
            Chinonso Okeke
          </h2>
          <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-12 w-full'>
            <div className='flex flex-col items-center md:items-start gap-1 text-center md:text-left'>
              <span className='text-sm md:text-base text-muted'>Date created</span>
              <span className='text-sm md:text-base text-foreground font-medium'>
                Joined February 2026
              </span>
            </div>
            <div className='flex flex-col items-center md:items-start gap-1 text-center md:text-left'>
              <span className='text-sm md:text-base text-muted'>Dedicated account</span>
              <span className='text-sm md:text-base text-foreground font-medium'>
                3024567891
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-[12px] px-6 py-8 flex flex-col gap-6'>
        {/* Tabs (Pill style) */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center p-1 bg-gray-100 rounded-[12px] border border-stroke-2/50'>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-1.5 text-xs font-medium rounded-full transition-all',
                  tab === t
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-xental-text-primary-500 hover:text-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='mt-2'>
          {tab === 'Recent transactions' && (
            <div className='flex flex-col gap-5'>
              {/* Table Toolbar */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <h3 className='text-sm font-semibold text-foreground'>
                  Recent transactions
                </h3>
                <div className='flex flex-wrap items-center gap-3'>
                  <FilterDropdown
                    label='Date'
                    options={['Today', 'Last 7 days', 'Last 30 days']}
                    value={dateFilter}
                    onChange={setDateFilter}
                  />
                  <FilterDropdown
                    label='Status'
                    options={['Successful', 'Failed', 'Pending']}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                  <Button
                    size='sm'
                    className='gap-1.5 px-4 h-8 bg-action-blue hover:bg-action-blue/90'
                  >
                    <Download className='w-3.5 h-3.5' /> Export
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className='overflow-x-auto'>
                <table className='w-full text-xs'>
                  <thead>
                    <tr className='border-b border-stroke-2'>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[25%]'>
                        Transaction ID
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[25%]'>
                        Date
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[25%]'>
                        Amount
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[253px]'>
                        Status
                      </th>
                      <th className='p py-3 w-8' />
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TRANSACTIONS.map((tx, idx) => (
                      <tr
                        key={idx}
                        className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'
                      >
                        <td className='px-4 py-3.5 text-xental-text-primary-500 font-medium'>
                          {tx.ref}
                        </td>
                        <td className='px-4 py-3.5 text-xental-text-primary-500'>
                          {tx.date}
                        </td>
                        <td className='px-4 py-3.5 text-foreground font-medium'>
                          {tx.amount}
                        </td>
                        <td className='px-3 py-3.5'>
                          <span
                            className={cn(
                              'px-2.5 py-1 rounded-md text-[11px] font-medium',
                              STATUS_BADGE[tx.status]
                            )}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className='px-4 py-3.5 text-right'>
                          <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 cursor-pointer inline-block' />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'Profile' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 lg:gap-x-24 w-full'>
              {/* Left Column */}
              <div className='flex flex-col gap-10'>
                <DetailBlock label='Account name' value='Chinonso Okeke' />
                <div className='flex items-center gap-12 sm:gap-16'>
                  <DetailBlock label='Country code' value='+234' />
                  <DetailBlock label='Phone number' value='703 678 8000' />
                </div>
                <DetailBlock label='KYC' value='Verified' />
              </div>

              {/* Right Column */}
              <div className='flex flex-col gap-10'>
                <div className='flex items-center gap-12 sm:gap-16 lg:gap-24'>
                  <DetailBlock label='Bank name' value='Nombank MFB' />
                  <DetailBlock label='Dedicated account' value='3024567891' />
                </div>
                <DetailBlock label='Email' value='okeechinonso@gmail.com' />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
