'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Download, Link2, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import { useTransactions, useRefundTransaction } from '@/api/dashboard';
import { useVirtualAccount, useDeleteVirtualAccount } from '@/api/virtual-accounts';
import { useCreateCheckoutSession } from '@/api/checkout';
import { useHoldSettlement, useReleaseSettlement } from '@/api/settlement';
import { useSubMerchantsList } from '@/api/sub-merchants';
import { CustomerSubscriptions } from './CustomerSubscriptions';

type Tab = 'Recent transactions' | 'Subscriptions' | 'Profile';
const TABS: Tab[] = ['Recent transactions', 'Subscriptions', 'Profile'];

const STATUS_BADGE: Record<string, string> = {
  Successful: 'bg-green-50 text-success',
  Success: 'bg-green-50 text-success',
  Failed: 'bg-red-50 text-destructive',
  Pending: 'bg-orange-50 text-pending',
};

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

export function CustomerDetailView({ accountRef }: { accountRef: string }) {
  const router = useRouter();

  const { data: profile, isLoading: isProfileLoading } = useVirtualAccount(accountRef);
  const { data: transactions = [], isLoading: isTxLoading } = useTransactions({ accountRef });
  const deleteCustomer = useDeleteVirtualAccount();
  const createLink = useCreateCheckoutSession();
  const holdSettlement = useHoldSettlement();
  const releaseSettlement = useReleaseSettlement();
  const refund = useRefundTransaction();
  const { data: subMerchants = [] } = useSubMerchantsList();
  const subMerchant = subMerchants.find((s) => s.id === profile?.subMerchantId);

  const [tab, setTab] = useState<Tab>('Recent transactions');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleDelete = () => {
    if (!profile?.accountRef) return;
    if (!window.confirm('Delete this customer? This cannot be undone. Customers with payment activity cannot be deleted.')) return;
    deleteCustomer.mutate(profile.accountRef, {
      onSuccess: () => router.push('/dashboard/customers'),
    });
  };

  const handlePaymentLink = () => {
    if (!profile?.accountRef) return;
    createLink.mutate(
      { accountRef: profile.accountRef },
      { onSuccess: (res) => setPaymentLink(res.snapshotUrl) }
    );
  };

  const handleRefund = (reference: string | null) => {
    if (!reference) return;
    if (!window.confirm('Refund the overpaid surplus on this transaction to the payer?')) return;
    refund.mutate({ reference });
  };

  const copyLink = () => {
    if (!paymentLink) return;
    navigator.clipboard.writeText(paymentLink).then(() => toast.success('Payment link copied'));
  };

  if (isProfileLoading) {
    return <div className="p-8 text-center text-xental-text-primary-400">Loading customer details...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-destructive">Customer not found</div>;
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col gap-3'>
        <Link
          href='/dashboard/customers'
          className='flex items-center gap-2 text-sm text-xental-text-primary-400 hover:text-foreground transition-colors w-fit'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to customers
        </Link>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <h1 className='text-2xl font-bold text-foreground'>Customer Details</h1>
          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePaymentLink}
              disabled={createLink.isPending}
              className='gap-1.5'
            >
              <Link2 className='w-3.5 h-3.5' />
              {createLink.isPending ? 'Generating...' : 'Payment link'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => profile.accountRef && holdSettlement.mutate({ accountRef: profile.accountRef })}
              disabled={holdSettlement.isPending}
            >
              Hold payout
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => profile.accountRef && releaseSettlement.mutate(profile.accountRef)}
              disabled={releaseSettlement.isPending}
            >
              Release
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDelete}
              disabled={deleteCustomer.isPending}
              className='gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10'
            >
              <Trash2 className='w-3.5 h-3.5' />
              {deleteCustomer.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
        {paymentLink && (
          <div className='flex items-center justify-between gap-3 rounded-lg border border-stroke-2 bg-xental-bg px-3 py-2'>
            <span className='truncate text-xs text-xental-text-primary-500'>{paymentLink}</span>
            <button
              type='button'
              onClick={copyLink}
              className='shrink-0 flex items-center gap-1 text-xs text-action-blue hover:opacity-80'
            >
              <Copy className='w-3.5 h-3.5' /> Copy
            </button>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className='bg-white rounded-[12px] px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
        <div className='w-24 h-24 md:w-[120px] md:h-[120px] rounded-full overflow-hidden shrink-0 bg-xental-blue-100 flex items-center justify-center'>
          <span className='text-4xl font-bold text-action-blue'>
            {(profile.customerName ?? profile.accountName ?? 'C').charAt(0).toUpperCase()}
          </span>
        </div>
        <div className='flex flex-col items-center md:items-start gap-4 md:gap-3 w-full'>
          <h2 className='text-xl md:text-lg font-semibold text-foreground'>
            {profile.customerName ?? profile.accountName ?? '—'}
          </h2>
          <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-12 w-full'>
            <div className='flex flex-col items-center md:items-start gap-1 text-center md:text-left'>
              <span className='text-sm md:text-base text-muted'>Date created</span>
              <span className='text-sm md:text-base text-foreground font-medium'>
                Joined {formatDate(profile.createdAtUtc)}
              </span>
            </div>
            <div className='flex flex-col items-center md:items-start gap-1 text-center md:text-left'>
              <span className='text-sm md:text-base text-muted'>Dedicated account</span>
              <span className='text-sm md:text-base text-foreground font-medium'>
                {profile.accountNumber ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-[12px] px-6 py-8 flex flex-col gap-6'>
        {/* Tabs */}
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
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-xs'>
                  <thead>
                    <tr className='border-b border-stroke-2'>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[22%]'>
                        Transaction ID
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[20%]'>
                        Date
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[18%]'>
                        Amount
                      </th>
                      <th className='text-left px-4 py-3 font-semibold text-foreground w-[20%]'>
                        Status
                      </th>
                      <th className='text-right px-4 py-3 font-semibold text-foreground'>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isTxLoading ? (
                      <tr><td colSpan={5} className="py-8 text-center text-xental-text-primary-400">Loading transactions...</td></tr>
                    ) : transactions.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-xental-text-primary-400">No transactions found</td></tr>
                    ) : (
                      transactions.map((tx) => {
                        const isOverpaid = tx.reconciliation === 'Overpaid';
                        return (
                          <tr
                            key={tx.id}
                            className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'
                          >
                            <td className='px-4 py-3.5 text-xental-text-primary-500 font-medium'>
                              {tx.reference ?? '—'}
                            </td>
                            <td className='px-4 py-3.5 text-xental-text-primary-500'>
                              {formatDate(tx.occurredAtUtc)}
                            </td>
                            <td className='px-4 py-3.5 text-foreground font-medium'>
                              {koboToNaira(tx.amountKobo)}
                            </td>
                            <td className='px-3 py-3.5'>
                              <span
                                className={cn(
                                  'px-2.5 py-1 rounded-md text-[11px] font-medium',
                                  STATUS_BADGE[tx.status ?? 'Pending'] ?? 'bg-gray-50 text-gray-500'
                                )}
                              >
                                {tx.reconciliation ?? tx.status ?? 'Pending'}
                              </span>
                            </td>
                            <td className='px-4 py-3.5 text-right'>
                              {isOverpaid ? (
                                <button
                                  type='button'
                                  onClick={() => handleRefund(tx.reference)}
                                  disabled={refund.isPending}
                                  className='inline-flex items-center gap-1 text-[11px] font-medium text-action-blue hover:opacity-80 disabled:opacity-50'
                                >
                                  <RotateCcw className='w-3.5 h-3.5' /> Refund surplus
                                </button>
                              ) : (
                                <span className='text-xental-text-primary-400'>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'Subscriptions' && profile.accountRef && (
            <CustomerSubscriptions accountRef={profile.accountRef} />
          )}

          {tab === 'Profile' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 lg:gap-x-24 w-full'>
              {/* Left Column — who the customer is */}
              <div className='flex flex-col gap-10'>
                <DetailBlock label='Customer name' value={profile.customerName ?? profile.accountName ?? '—'} />
                <DetailBlock label='Email' value={profile.customerEmail ?? '—'} />
                <DetailBlock label='Phone number' value={profile.customerPhone ?? '—'} />
                <DetailBlock label='Customer reference' value={profile.accountRef ?? '—'} />
                <DetailBlock
                  label='Sub-merchant'
                  value={subMerchant ? `${subMerchant.name}${subMerchant.reference ? ` (${subMerchant.reference})` : ''}` : 'Main account'}
                />
                <DetailBlock label='Date created' value={formatDate(profile.createdAtUtc)} />
              </div>

              {/* Right Column — the dedicated account + balances */}
              <div className='flex flex-col gap-10'>
                <DetailBlock label='Bank name' value={profile.bankName ?? '—'} />
                <DetailBlock label='Dedicated account' value={profile.accountNumber ?? '—'} />
                <DetailBlock label='Account name' value={profile.accountName ?? '—'} />
                <div className='flex items-center gap-12 sm:gap-16'>
                  <DetailBlock
                    label='Expected amount'
                    value={profile.expectedAmountKobo != null ? koboToNaira(profile.expectedAmountKobo) : '—'}
                  />
                  <DetailBlock label='Amount paid' value={koboToNaira(profile.amountPaidKobo)} />
                </div>
                <div className='flex items-center gap-12 sm:gap-16'>
                  <DetailBlock label='Payment state' value={profile.paymentState ?? '—'} />
                  <DetailBlock label='Status' value={profile.status ?? '—'} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
