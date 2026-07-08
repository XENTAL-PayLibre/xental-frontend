'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useSetSubMerchantPayout } from '@/api/sub-merchants';
import type { SubMerchantResponse } from '@/api/types/dashboard';

interface PayoutAccountModalProps {
  subMerchant: SubMerchantResponse | null;
  onClose: () => void;
}

export function PayoutAccountModal({ subMerchant, onClose }: PayoutAccountModalProps) {
  const save = useSetSubMerchantPayout();
  const [form, setForm] = useState({ bankName: '', bankCode: '', accountNumber: '', feePercent: '' });

  useEffect(() => {
    if (subMerchant) {
      setForm({
        bankName: subMerchant.settlementBankName ?? '',
        bankCode: subMerchant.settlementBankCode ?? '',
        accountNumber: subMerchant.settlementAccountNumber ?? '',
        feePercent: subMerchant.platformFeeBps ? String(subMerchant.platformFeeBps / 100) : '',
      });
    }
  }, [subMerchant]);

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!subMerchant) return;
    if (!form.bankName.trim() || !form.bankCode.trim() || !form.accountNumber.trim()) return;
    save.mutate(
      {
        id: subMerchant.id,
        bankName: form.bankName.trim(),
        bankCode: form.bankCode.trim(),
        accountNumber: form.accountNumber.trim(),
        platformFeeBps: Math.round((parseFloat(form.feePercent) || 0) * 100),
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal open={!!subMerchant} onClose={onClose} title='Payout account' className='max-w-lg'>
      {subMerchant && (
        <div className='mt-2 space-y-4'>
          <p className='text-xs text-xental-text-primary-400'>
            Settlement destination for <span className='font-medium text-foreground'>{subMerchant.name}</span>. The account name is resolved from the bank.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Bank name</label>
              <input value={form.bankName} onChange={(e) => set('bankName')(e.target.value)} placeholder='GTBank' className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Bank code</label>
              <input value={form.bankCode} onChange={(e) => set('bankCode')(e.target.value)} placeholder='000013' className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Account number</label>
              <input value={form.accountNumber} onChange={(e) => set('accountNumber')(e.target.value)} placeholder='0123456789' className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Platform fee (%)</label>
              <input value={form.feePercent} onChange={(e) => set('feePercent')(e.target.value)} placeholder='e.g. 2.5' className={inputClass} />
            </div>
          </div>
          <div className='flex justify-end gap-2 pt-1'>
            <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
            <Button type='button' onClick={handleSave} disabled={save.isPending}>
              {save.isPending ? 'Saving...' : 'Save payout account'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
