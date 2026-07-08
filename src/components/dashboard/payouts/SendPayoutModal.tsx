'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useBankLookup, useCreateTransfer } from '@/api/transfers';

interface SendPayoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function SendPayoutModal({ open, onClose }: SendPayoutModalProps) {
  const lookup = useBankLookup();
  const send = useCreateTransfer();

  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [resolvedName, setResolvedName] = useState<string | null>(null);

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  const reset = () => {
    setAccountNumber('');
    setBankCode('');
    setAmount('');
    setNarration('');
    setResolvedName(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleLookup = () => {
    if (!accountNumber || !bankCode) return;
    lookup.mutate(
      { accountNumber, bankCode },
      { onSuccess: (res) => setResolvedName(res.accountName) }
    );
  };

  const handleSend = () => {
    const naira = parseFloat(amount);
    if (!naira || naira <= 0 || !accountNumber || !bankCode) return;
    send.mutate(
      {
        merchantTxRef: `payout_${Date.now()}`,
        amountKobo: Math.round(naira * 100),
        accountNumber,
        bankCode,
        ...(narration ? { narration } : {}),
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal open={open} onClose={handleClose} title='Send payout' className='max-w-lg'>
      <div className='mt-2 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Account number</label>
            <input value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value); setResolvedName(null); }} placeholder='0123456789' className={inputClass} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Bank code</label>
            <input value={bankCode} onChange={(e) => { setBankCode(e.target.value); setResolvedName(null); }} placeholder='000014' className={inputClass} />
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Button type='button' variant='outline' size='sm' onClick={handleLookup} disabled={lookup.isPending || !accountNumber || !bankCode}>
            {lookup.isPending ? 'Resolving...' : 'Resolve account'}
          </Button>
          {resolvedName && (
            <span className='flex items-center gap-1.5 text-sm text-success'>
              <CheckCircle2 className='h-4 w-4' /> {resolvedName}
            </span>
          )}
        </div>

        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Amount (₦)</label>
          <input type='number' min='0' step='0.01' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='0' className={inputClass} />
        </div>

        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Narration (optional)</label>
          <input value={narration} onChange={(e) => setNarration(e.target.value)} placeholder='Payout' className={inputClass} />
        </div>

        <div className='flex justify-end gap-2 pt-1'>
          <Button type='button' variant='outline' onClick={handleClose}>Cancel</Button>
          <Button type='button' onClick={handleSend} disabled={send.isPending}>
            {send.isPending ? 'Sending...' : 'Send payout'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
