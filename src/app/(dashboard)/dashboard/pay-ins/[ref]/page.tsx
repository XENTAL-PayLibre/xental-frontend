'use client';

import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useTransaction } from '@/api/dashboard';

const STATUS_STYLES: Record<string, { text: string; bg: string }> = {
  Successful: { text: 'text-success', bg: 'bg-green-50' },
  Failed: { text: 'text-destructive', bg: 'bg-red-50' },
  Pending: { text: 'text-pending', bg: 'bg-amber-50' },
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
  const { data: tx, isLoading } = useTransaction(ref);

  const status = tx?.status ?? 'Pending';
  const styles = STATUS_STYLES[status] ?? { text: 'text-pending', bg: 'bg-amber-50' };

  if (isLoading) {
    return (
      <div className='flex flex-col gap-5'>
        <div className='h-8 bg-xental-bg rounded animate-pulse w-48' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-white rounded-xl border border-stroke-2 p-5 h-64 animate-pulse' />
          <div className='bg-white rounded-xl border border-stroke-2 p-5 h-64 animate-pulse' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5'>
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
        <div className='bg-white rounded-xl border border-stroke-2 p-5'>
          <h3 className='text-sm font-semibold text-foreground mb-1'>Transaction Summary</h3>
          <p className='text-xs text-xental-text-primary-400 mb-4'>Details of this pay-in transaction</p>
          <DetailRow label='Transaction ID' value={tx?.id ?? '—'} valueClass='font-mono text-[10px]' />
          <DetailRow
            label='Status'
            value={
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles.bg, styles.text)}>
                {status}
              </span>
            }
          />
          <DetailRow label='Reconciliation' value={tx?.reconciliation ?? '—'} />
          <DetailRow label='Payment reference' value={ref} valueClass='font-mono' />
          <DetailRow label='Amount' value={tx ? koboToNaira(tx.amountKobo) : '—'} />
          <DetailRow label='Fee' value={tx ? koboToNaira(tx.feeKobo) : '—'} />
          <DetailRow label='Net credit' value={tx ? koboToNaira(tx.netCreditKobo) : '—'} />
          <DetailRow label='Currency' value='NGN' />
          <DetailRow label='Payment method' value='Bank Transfer' />
          <DetailRow label='Date and Time' value={tx ? formatDate(tx.occurredAtUtc) : '—'} />
          {tx?.reconciledAtUtc && (
            <DetailRow label='Reconciled at' value={formatDate(tx.reconciledAtUtc)} />
          )}
        </div>

        <div className='bg-white rounded-xl border border-stroke-2 p-5'>
          <h3 className='text-sm font-semibold text-foreground mb-1'>Account Details</h3>
          <p className='text-xs text-xental-text-primary-400 mb-4'>Sender and account information</p>
          <DetailRow label='Sender name' value={tx?.transferName ?? '—'} />
          <DetailRow label='Virtual account ID' value={tx?.virtualAccountId ?? '—'} valueClass='font-mono text-[10px]' />
          <DetailRow label='Risk score' value={tx ? String(tx.riskScore) : '—'} />
          {tx?.reason && <DetailRow label='Reason' value={tx.reason} />}
        </div>
      </div>

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
