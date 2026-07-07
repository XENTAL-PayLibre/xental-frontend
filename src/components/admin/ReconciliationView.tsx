'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReconciliationSummary, useReconciliationBucket, useFailedSettlements, useRetrySettlement } from '@/api/admin';
import type { ReconciliationSummary, ReconciliationTransaction, FailedSettlement } from '@/api/types/admin';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { Pagination } from '@/components/ui/Pagination';
import { AlertCircle, HelpCircle, ArrowUpCircle, ArrowDownCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { koboToNaira } from '@/lib/utils';

const PAGE_SIZE = 10;

const BUCKET_CONFIG = {
  review: { label: 'Review', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  unknown: { label: 'Unknown', icon: HelpCircle, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
  overpaid: { label: 'Overpaid', icon: ArrowUpCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  underpaid: { label: 'Underpaid', icon: ArrowDownCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
  highRisk: { label: 'High Risk', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  reversals: { label: 'Reversals', icon: RotateCcw, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
};

const MOCK_SUMMARY: ReconciliationSummary = {
  review: 12,
  unknown: 3,
  overpaid: 5,
  underpaid: 2,
  highRisk: 1,
  reversals: 0,
};

// Removed static MOCK_BUCKET_DATA

const MOCK_FAILED_SETTLEMENTS: FailedSettlement[] = [
  {
    virtualAccountId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    tenantId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    accountRef: 'acc-101',
    netKobo: 4900000,
    failureReason: 'Network timeout during provider sweep process. Service unavailable.',
    failedAtUtc: new Date().toISOString(),
  }
];

export default function ReconciliationView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buckets' | 'settlements'>('buckets');
  const [activeBucket, setActiveBucket] = useState<keyof ReconciliationSummary | ''>('');
  const [bucketPage, setBucketPage] = useState(1);
  const [failedPage, setFailedPage] = useState(1);

  const { data: rawSummary, isLoading: summaryLoading } = useReconciliationSummary();
  const { data: rawBucketData, isLoading: bucketLoading } = useReconciliationBucket(activeBucket);

  // Use mock data if API is empty for UI testing
  const summary = rawSummary || MOCK_SUMMARY;

  const bucketCount = activeBucket
    ? (summary[activeBucket as keyof ReconciliationSummary] || 0)
    : Object.values(summary).reduce((acc, curr) => acc + curr, 0);

  const bucketData = rawBucketData || Array.from({ length: bucketCount }).map((_, i) => ({
    id: `mock-${activeBucket || 'all'}-${i}`,
    tenantId: 'tenant-456',
    virtualAccountId: 'va-789',
    reference: `PAY-${10000 + i}`,
    amountKobo: 5000000 + i * 150000,
    netCreditKobo: 4900000 + i * 150000,
    status: 'Failed',
    reconciliation: activeBucket ? BUCKET_CONFIG[activeBucket as keyof ReconciliationSummary].label : 'Unknown',
    reason: 'Amount paid does not match invoice. Requires manual review of ledger balances and external confirmation from provider gateway before progressing.',
    riskScore: 60 + (i % 35),
    transferName: 'John Doe',
    occurredAtUtc: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  const paginatedBucketData = bucketData.slice((bucketPage - 1) * PAGE_SIZE, bucketPage * PAGE_SIZE);
  const bucketTotalPages = Math.max(1, Math.ceil(bucketData.length / PAGE_SIZE));

  const { data: rawFailedSettlements, isLoading: failedLoading } = useFailedSettlements();
  const { mutate: retrySettlement, isPending: retrying } = useRetrySettlement();

  const failedSettlements = rawFailedSettlements || Array.from({ length: 15 }).map((_, i) => ({
    virtualAccountId: `va-${900 + i}-retry`,
    tenantId: 'tenant-456',
    accountRef: `customer-${900 + i}`,
    netKobo: 4900000,
    failedAtUtc: new Date(Date.now() - 86400000 * i).toISOString(),
    failureReason: 'Provider gateway timeout during scheduled night-time settlement run.',
  }));

  const paginatedFailedSettlements = failedSettlements.slice((failedPage - 1) * PAGE_SIZE, failedPage * PAGE_SIZE);
  const failedTotalPages = Math.max(1, Math.ceil(failedSettlements.length / PAGE_SIZE));

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-foreground'>Admin Reconciliation</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>
          Reconciliation console — exception buckets + failed-settlement retry (audited).
        </p>
      </div>

      {/* Summary Tiles */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {(Object.entries(BUCKET_CONFIG) as [keyof ReconciliationSummary, any][]).map(([key, config]) => {
          const Icon = config.icon;
          const count = summary[key as keyof ReconciliationSummary] ?? 0;

          const iconElement = (
            <div className={`p-2 rounded-lg inline-flex w-fit bg-xental-bg`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
          );

          return (
            <StatCard
              key={key}
              icon={iconElement}
              label={config.label}
              value={String(count)}
            />
          );
        })}
      </div>

      {/* Tabs */}
      <div className='flex items-center gap-6 border-b border-stroke-2 mt-2'>
        <button
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'buckets' ? 'border-action-blue text-action-blue' : 'border-transparent text-xental-text-primary-400 hover:text-foreground'
          }`}
          onClick={() => {
            setActiveTab('buckets');
            setBucketPage(1);
          }}
        >
          Exception Buckets
        </button>
        <button
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'settlements' ? 'border-action-blue text-action-blue' : 'border-transparent text-xental-text-primary-400 hover:text-foreground'
          }`}
          onClick={() => {
            setActiveTab('settlements');
            setFailedPage(1);
          }}
        >
          Failed Settlements
          {failedSettlements.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === 'settlements' ? 'bg-action-blue text-white' : 'bg-red-100 text-red-600'
            }`}>
              {failedSettlements.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className='rounded-2xl border border-stroke-2 bg-white flex flex-col mt-2'>
        {activeTab === 'buckets' && (
          <>
            <div className='flex flex-row items-center justify-between gap-3 px-4 py-3 border-b border-stroke-2'>
              <h2 className='text-sm font-semibold whitespace-nowrap'>Exception Transactions</h2>
              <div className='flex items-center gap-2 w-full sm:w-auto justify-end'>
                <FilterDropdown
                  label="Bucket"
                  options={Object.entries(BUCKET_CONFIG).map(([key, config]) => ({ label: config.label, value: key }))}
                  value={activeBucket}
                  onChange={(v) => {
                    setActiveBucket(v as keyof ReconciliationSummary | '');
                    setBucketPage(1);
                  }}
                />
              </div>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-[11px] whitespace-nowrap'>
                <thead>
                  <tr className='border-b border-stroke-2'>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Reference</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Tenant</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Virtual Acc.</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Transfer Name</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Amount</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Net Credit</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Recon Status</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Reason</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Risk Score</th>
                    <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bucketLoading && !rawBucketData ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className='border-b border-stroke-2'>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-12'></div></td>
                        <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div></td>
                      </tr>
                    ))
                  ) : bucketData.length === 0 ? (
                    <tr><td colSpan={11} className="p-10 text-center text-xental-text-primary-400">No transactions currently flagged in this bucket.</td></tr>
                  ) : paginatedBucketData.map((tx) => (
                    <tr
                      key={tx.id}
                      className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg cursor-pointer'
                      onClick={() => router.push(`/admin/reconciliation/${tx.id}?bucket=${activeBucket}`)}
                    >
                      <td className='px-4 py-3 font-mono'>{tx.reference}</td>
                      <td className='px-4 py-3 font-mono'>{tx.tenantId.slice(0, 8)}...</td>
                      <td className='px-4 py-3 font-mono'>{tx.virtualAccountId.slice(0, 8)}...</td>
                      <td className='px-4 py-3 font-medium'>{tx.transferName}</td>
                      <td className='px-4 py-3 font-medium text-foreground'>{koboToNaira(tx.amountKobo)}</td>
                      <td className='px-4 py-3 font-medium text-foreground'>{koboToNaira(tx.netCreditKobo)}</td>
                      <td className='px-4 py-3'>{tx.status}</td>
                      <td className='px-4 py-3 font-medium'>{tx.reconciliation}</td>
                      <td className='px-4 py-3 text-xental-text-primary-500 max-w-[150px] truncate' title={tx.reason}>{tx.reason || '-'}</td>
                      <td className='px-4 py-3'>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {tx.riskScore}
                        </span>
                      </td>
                      <td className='px-4 py-3 text-xental-text-primary-400'>{new Date(tx.occurredAtUtc).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={bucketPage}
              totalPages={bucketTotalPages}
              totalItems={bucketData.length}
              onPageChange={setBucketPage}
            />
          </>
        )}

        {activeTab === 'settlements' && (
          <>
            <div className='overflow-x-auto'>
            <table className='w-full text-xs'>
              <thead>
                <tr className='border-b border-stroke-2'>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Virtual Account ID</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Account Ref</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Net Value</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Failure Reason</th>
                  <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400 w-32'>Failed At</th>
                  <th className='text-right px-4 py-3 font-medium text-xental-text-primary-400 w-24'>Action</th>
                </tr>
              </thead>
              <tbody>
                {failedLoading && !rawFailedSettlements ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className='border-b border-stroke-2'>
                      <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div></td>
                      <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div></td>
                      <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div></td>
                      <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div></td>
                      <td className='px-4 py-4'><div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div></td>
                      <td className='px-4 py-4'><div className='h-6 bg-gray-200 rounded animate-pulse w-16 float-right'></div></td>
                    </tr>
                  ))
                ) : failedSettlements.length === 0 ? (
                  <tr><td colSpan={6} className="p-10 text-center text-xental-text-primary-400">No failed settlements awaiting retry.</td></tr>
                ) : paginatedFailedSettlements.map((fs) => (
                  <tr key={fs.virtualAccountId} className='border-b border-stroke-2 last:border-0 hover:bg-xental-bg'>
                    <td className='px-4 py-3 font-mono text-[11px]'>{fs.virtualAccountId.split('-')[0]}...</td>
                    <td className='px-4 py-3 font-medium'>{fs.accountRef}</td>
                    <td className='px-4 py-3 font-medium text-foreground'>{koboToNaira(fs.netKobo)}</td>
                    <td className='px-4 py-3 text-red-600 truncate max-w-sm' title={fs.failureReason}>{fs.failureReason}</td>
                    <td className='px-4 py-3 text-xental-text-primary-400'>{new Date(fs.failedAtUtc).toLocaleString()}</td>
                    <td className='px-4 py-3 text-right'>
                      <Button
                        size="sm"
                        onClick={() => retrySettlement(fs.virtualAccountId)}
                        disabled={retrying}
                        className='text-[11px] h-7 px-3 flex items-center gap-1.5 cursor-pointer'
                      >
                        <RotateCcw className="w-3 h-3" /> Retry
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={failedPage}
            totalPages={failedTotalPages}
            totalItems={failedSettlements.length}
            onPageChange={setFailedPage}
          />
        </>
        )}
      </div>
    </div>
  );
}
