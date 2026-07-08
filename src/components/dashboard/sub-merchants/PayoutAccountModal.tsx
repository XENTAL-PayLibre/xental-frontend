'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useSetSubMerchantPayout } from '@/api/sub-merchants';
import { useBankLookup } from '@/api/transfers';
import type { SubMerchantResponse } from '@/api/types/dashboard';

interface PayoutAccountModalProps {
  subMerchant: SubMerchantResponse | null;
  onClose: () => void;
}

export function PayoutAccountModal({ subMerchant, onClose }: PayoutAccountModalProps) {
  const save = useSetSubMerchantPayout();
  const bankLookup = useBankLookup();
  const [form, setForm] = useState({ bankName: '', bankCode: '', accountNumber: '', feePercent: '' });
  const [resolvedName, setResolvedName] = useState<string | null>(null);

  useEffect(() => {
    if (subMerchant) {
      setForm({
        bankName: subMerchant.settlementBankName ?? '',
        bankCode: subMerchant.settlementBankCode ?? '',
        accountNumber: subMerchant.settlementAccountNumber ?? '',
        feePercent: subMerchant.platformFeeBps ? String(subMerchant.platformFeeBps / 100) : '',
      });
      setResolvedName(subMerchant.settlementAccountName ?? null);
    }
  }, [subMerchant]);

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';
  const set = (k: keyof typeof form) => (v: string) => { setForm((f) => ({ ...f, [k]: v })); setResolvedName(null); };

  const resolveAccountName = () => {
    if (form.accountNumber.trim().length < 10 || !form.bankCode.trim()) return;
    bankLookup.mutate(
      { accountNumber: form.accountNumber.trim(), bankCode: form.bankCode.trim() },
      { onSuccess: (res) => setResolvedName(res.accountName) }
    );
  };

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
              <input value={form.bankCode} onChange={(e) => set('bankCode')(e.target.value)} onBlur={resolveAccountName} placeholder='000013' className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Account number</label>
              <input value={form.accountNumber} onChange={(e) => set('accountNumber')(e.target.value)} onBlur={resolveAccountName} placeholder='0123456789' className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-foreground'>Platform fee (%)</label>
              <input value={form.feePercent} onChange={(e) => set('feePercent')(e.target.value)} placeholder='e.g. 2.5' className={inputClass} />
            </div>
          </div>

          {bankLookup.isPending && <p className='text-xs text-xental-text-primary-400'>Resolving account…</p>}
          {resolvedName && (
            <p className='flex items-center gap-1.5 text-sm text-success'>
              <CheckCircle2 className='h-4 w-4' /> {resolvedName}
            </p>
          )}
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
