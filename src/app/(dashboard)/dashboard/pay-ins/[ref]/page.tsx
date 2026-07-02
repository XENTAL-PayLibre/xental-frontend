'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TxStatus = 'Successful' | 'Failed' | 'Pending';

const STATUS_STYLES: Record<TxStatus, { text: string; bg: string }> = {
  Successful: { text: 'text-success', bg: 'bg-green-50' },
  Failed: { text: 'text-destructive', bg: 'bg-red-50' },
  Pending: { text: 'text-pending', bg: 'bg-amber-50' },
};

const MOCK_DATA: Record<string, { status: TxStatus; amount: string; customer: string; account: string; narration: string }> = {
  REF202001: { status: 'Successful', amount: '₦45,750', customer: 'Chinonso Okeke', account: '8061782007', narration: 'June Contribution' },
  REF202002: { status: 'Successful', amount: '₦30,200', customer: 'Amara Nwosu', account: '2375849108', narration: 'School Fees' },
  REF202003: { status: 'Pending', amount: '₦15,000', customer: 'Emeka Obi', account: '8061782008', narration: 'Tuition Payment' },
  REF202004: { status: 'Failed', amount: '₦80,750', customer: 'Fatima Bello', account: '4928375610', narration: 'Term Payment' },
};

function DetailRow({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className='flex items-center justify-between py-3 border-b border-stroke-2 last:border-0'>
      <span className='text-xs text-xental-text-primary-400'>{label}</span>
      <span className={cn('text-xs text-foreground font-medium', valueClass)}>{value}</span>
    </div>
  );
}

export default function PayInDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = use(params);
  const data = MOCK_DATA[ref] ?? { status: 'Successful' as TxStatus, amount: '₦45,750', customer: 'Chinonso Okeke', account: '3024567891', narration: 'June Contribution' };
  const styles = STATUS_STYLES[data.status];

  return (
    <div className='flex flex-col gap-5'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link href='/dashboard/pay-ins'>
            <ArrowLeft className='w-4 h-4 text-xental-text-primary-400 hover:text-foreground' />
          </Link>
          <div>
            <p className='text-xs text-xental-text-primary-400'>Reference</p>
            <h1 className='text-xl font-bold text-foreground font-mono'>{ref}</h1>
          </div>
        </div>
        <Button size='sm' variant='outline' className='gap-1.5'>
          <Download className='w-3.5 h-3.5' /> Export
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* Transaction Summary */}
        <div className='bg-white rounded-xl border border-stroke-2 p-5'>
          <h3 className='text-sm font-semibold text-foreground mb-1'>Transaction Summary</h3>
          <p className='text-xs text-xental-text-primary-400 mb-4'>Details of this pay-in transaction</p>
          <DetailRow label='Transaction ID' value={`TXN${ref.replace('REF', '')}`} valueClass='font-mono' />
          <DetailRow
            label='Status'
            value={
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles.bg, styles.text)}>
                {data.status}
              </span>
            }
          />
          <DetailRow label='Payment reference' value={ref} valueClass='font-mono' />
          <DetailRow label='Amount' value={data.amount} />
          <DetailRow label='Fee' value='₦100.00' />
          <DetailRow label='Currency' value='NGN' />
          <DetailRow label='Payment method' value='Bank Transfer' />
          <DetailRow label='Date and Time' value='26 Jun 2026  22:55pm' />
        </div>

        {/* Account Details */}
        <div className='bg-white rounded-xl border border-stroke-2 p-5'>
          <h3 className='text-sm font-semibold text-foreground mb-1'>Account Details</h3>
          <p className='text-xs text-xental-text-primary-400 mb-4'>Customer and account information</p>
          <DetailRow label='Customer' value={data.customer} />
          <DetailRow label='Dedicated virtual account' value={data.account} valueClass='font-mono' />
          <DetailRow label='Narration' value={data.narration} />
        </div>
      </div>

      {/* Bottom actions */}
      <div className='flex items-center gap-3'>
        <Link href='/dashboard/pay-ins'>
          <Button size='sm' variant='outline'>
            <ArrowLeft className='w-3.5 h-3.5 mr-1.5' /> Back
          </Button>
        </Link>
        <Button size='sm' className='gap-1.5'>
          <Download className='w-3.5 h-3.5' /> Export
        </Button>
      </div>
    </div>
  );
}
