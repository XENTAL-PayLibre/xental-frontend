'use client';

import Modal from '@/components/ui/Modal';
import { koboToNaira } from '@/lib/utils';
import { useSubMerchantBalance } from '@/api/sub-merchants';
import type { SubMerchantResponse } from '@/api/types/dashboard';

interface BalanceModalProps {
  subMerchant: SubMerchantResponse | null;
  onClose: () => void;
}

export function BalanceModal({ subMerchant, onClose }: BalanceModalProps) {
  const { data: balance, isLoading } = useSubMerchantBalance(subMerchant?.id ?? null);

  const rows: Array<{ label: string; value: string }> = balance
    ? [
        { label: 'Collected', value: koboToNaira(balance.collectedKobo) },
        { label: 'Settled', value: koboToNaira(balance.settledKobo) },
        { label: 'Pending', value: koboToNaira(balance.pendingKobo) },
        { label: 'Virtual accounts', value: String(balance.virtualAccounts) },
      ]
    : [];

  return (
    <Modal open={!!subMerchant} onClose={onClose} title={`Balance — ${subMerchant?.name ?? ''}`} className='max-w-md'>
      <div className='mt-2'>
        {isLoading ? (
          <div className='py-6 text-center text-xs text-xental-text-primary-400'>Loading balance...</div>
        ) : (
          <div className='divide-y divide-stroke-2 rounded-lg border border-stroke-2'>
            {rows.map((r) => (
              <div key={r.label} className='flex items-center justify-between px-3 py-2.5'>
                <span className='text-xs text-xental-text-primary-400'>{r.label}</span>
                <span className='text-sm font-medium text-foreground'>{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
