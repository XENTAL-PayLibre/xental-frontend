'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useReconciliationBucket } from '@/api/admin';
import { koboToNaira } from '@/lib/utils';
import type { ReconciliationTransaction } from '@/api/types/admin';

function DetailBlock({ label, value, className = '' }: { label: string; value: string | React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span className='text-sm text-xental-text-primary-400 font-semibold'>{label}</span>
      <span className='text-base text-foreground font-medium break-all'>{value}</span>
    </div>
  );
}

export default function ReconciliationDetailView({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const bucket = searchParams.get('bucket') ?? '';

  const { data: bucketData, isLoading } = useReconciliationBucket(bucket);

  const tx = bucketData?.find((t) => t.id === id);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-3'>
          <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
          <div className='flex items-center justify-between'>
            <div className='h-8 bg-gray-200 rounded animate-pulse w-48'></div>
            <div className='h-6 bg-gray-200 rounded-full animate-pulse w-24'></div>
          </div>
        </div>
        <div className='bg-white rounded-[12px] p-6 md:p-8 flex flex-col gap-8 border border-stroke-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className='flex flex-col gap-2'>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                <div className='h-5 bg-gray-200 rounded animate-pulse w-32'></div>
              </div>
            ))}
          </div>
          <div className='border-t border-stroke-2 pt-6 mt-2 flex flex-col gap-2'>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
            <div className='h-5 bg-gray-200 rounded animate-pulse w-full max-w-3xl'></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-destructive">
        <p>Transaction not found in the {bucket} bucket.</p>
        <Link href="/admin/reconciliation" className="text-action-blue underline">Go back to reconciliation</Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col gap-3'>
        <Link
          href='/admin/reconciliation'
          className='flex items-center gap-2 text-sm text-xental-text-primary-400 hover:text-foreground transition-colors w-fit'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to reconciliation
        </Link>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-foreground'>Transaction Details</h1>
          <div className='flex gap-2 items-center'>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
              Risk Score: {tx.riskScore}
            </span>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div className='bg-white rounded-[12px] p-6 md:p-8 flex flex-col gap-8 border border-stroke-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <DetailBlock label="Reference" value={tx.reference} />
          <DetailBlock label="Status" value={tx.status} />
          <DetailBlock label="Reconciliation" value={tx.reconciliation} />
          
          <DetailBlock label="Amount" value={koboToNaira(tx.amountKobo)} />
          <DetailBlock label="Net Credit" value={koboToNaira(tx.netCreditKobo)} />
          <DetailBlock label="Date Occurred" value={new Date(tx.occurredAtUtc).toLocaleString()} />
          
          <DetailBlock label="Transfer Name" value={tx.transferName || '—'} />
          <DetailBlock label="Tenant ID" value={tx.tenantId} />
          <DetailBlock label="Virtual Account ID" value={tx.virtualAccountId} />
        </div>

        <div className='border-t border-stroke-2 pt-6 mt-2'>
          <DetailBlock 
            label="Exception Reason" 
            value={tx.reason || 'No specific reason provided for this exception.'} 
            className="col-span-full"
          />
        </div>
      </div>
    </div>
  );
}
