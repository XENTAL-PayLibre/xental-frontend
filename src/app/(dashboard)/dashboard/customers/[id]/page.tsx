'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Tab = 'Overview' | 'Transactions' | 'Dedicated Account';

const TABS: Tab[] = ['Overview', 'Transactions', 'Dedicated Account'];

type TxStatus = 'Successful' | 'Failed' | 'Pending';

const STATUS_STYLES: Record<TxStatus, string> = {
  Successful: 'text-success',
  Failed: 'text-destructive',
  Pending: 'text-pending',
};

const MOCK_TRANSACTIONS = [
  { ref: 'REF202001', amount: '₦45,750', date: '26 Jun 2026', status: 'Successful' as TxStatus },
  { ref: 'REF202002', amount: '₦30,200', date: '24 Jun 2026', status: 'Pending' as TxStatus },
  { ref: 'REF202003', amount: '₦80,000', date: '22 Jun 2026', status: 'Failed' as TxStatus },
  { ref: 'REF202004', amount: '₦62,500', date: '20 Jun 2026', status: 'Successful' as TxStatus },
];

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className='flex items-center justify-between py-3 border-b border-stroke-2 last:border-0'>
      <span className='text-xs text-xental-text-primary-400'>{label}</span>
      <span className={cn('text-xs text-foreground font-medium', mono && 'font-mono')}>{value}</span>
    </div>
  );
}

export default function CustomerDetailPage() {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link href='/dashboard/customers'>
            <ArrowLeft className='w-4 h-4 text-xental-text-primary-400 hover:text-foreground' />
          </Link>
          <div>
            <h1 className='text-xl font-bold text-foreground'>Chinonso Okeke</h1>
            <p className='text-xs text-xental-text-primary-400 mt-0.5'>chinonso@mail.com · +234 803 456 7890</p>
          </div>
        </div>
        <Button size='sm' variant='outline' className='gap-1.5'>
          <Download className='w-3.5 h-3.5' /> Export
        </Button>
      </div>

      {/* Tabs */}
      <div className='flex items-center gap-1 border-b border-stroke-2'>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              tab === t
                ? 'border-action-blue text-action-blue'
                : 'border-transparent text-xental-text-primary-400 hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-white rounded-xl border border-stroke-2 p-4'>
            <h3 className='text-xs font-semibold text-foreground mb-2'>Customer Details</h3>
            <DetailRow label='Full name' value='Chinonso Okeke' />
            <DetailRow label='Email' value='chinonso@mail.com' />
            <DetailRow label='Phone' value='+234 803 456 7890' />
            <DetailRow label='Date Created' value='30 Apr 2026' />
            <DetailRow label='Status' value='Active' />
          </div>
          <div className='bg-white rounded-xl border border-stroke-2 p-4'>
            <h3 className='text-xs font-semibold text-foreground mb-2'>Dedicated Account</h3>
            <DetailRow label='Account number' value='8061782007' mono />
            <DetailRow label='Bank' value='Nomba MFB' />
            <DetailRow label='Account name' value='Chinonso Okeke' />
            <DetailRow label='Status' value='Active' />
            <DetailRow label='Created' value='30 Apr 2026' />
          </div>
        </div>
      )}

      {tab === 'Transactions' && (
        <div className='bg-white rounded-xl border border-stroke-2'>
          <div className='overflow-x-auto'>
            <table className='w-full text-xs'>
              <thead>
                <tr className='border-b border-stroke-2'>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Reference</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Amount</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((tx) => (
                  <tr key={tx.ref} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg'>
                    <td className='px-4 py-3 font-mono text-foreground font-medium'>{tx.ref}</td>
                    <td className='px-4 py-3 text-foreground font-medium'>{tx.amount}</td>
                    <td className='px-4 py-3 text-xental-text-primary-500'>{tx.date}</td>
                    <td className='px-4 py-3'>
                      <span className={cn('font-medium', STATUS_STYLES[tx.status])}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Dedicated Account' && (
        <div className='bg-white rounded-xl border border-stroke-2 p-6 max-w-md'>
          <h3 className='text-sm font-semibold text-foreground mb-4'>Dedicated Virtual Account</h3>
          <div className='bg-xental-bg rounded-lg p-4 mb-4'>
            <p className='text-xs text-xental-text-primary-400 mb-1'>Account Number</p>
            <div className='flex items-center gap-2'>
              <p className='text-2xl font-bold text-foreground font-mono'>8061782007</p>
              <button onClick={() => navigator.clipboard.writeText('8061782007')}>
                <Copy className='w-4 h-4 text-xental-text-primary-400 hover:text-action-blue' />
              </button>
            </div>
            <p className='text-xs text-xental-text-primary-400 mt-1'>Nomba MFB · Chinonso Okeke</p>
          </div>
          <DetailRow label='Status' value='Active' />
          <DetailRow label='Created' value='30 Apr 2026' />
          <DetailRow label='Total received' value='₦45,750' />
        </div>
      )}
    </div>
  );
}
