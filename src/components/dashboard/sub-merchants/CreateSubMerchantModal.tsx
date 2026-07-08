'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { useCreateSubMerchant } from '@/api/sub-merchants';

interface CreateSubMerchantModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateSubMerchantModal({ open, onClose }: CreateSubMerchantModalProps) {
  const create = useCreateSubMerchant();
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  const handleClose = () => {
    setName('');
    setReference('');
    onClose();
  };

  const handleCreate = () => {
    if (!name.trim() || !reference.trim()) return;
    create.mutate({ name: name.trim(), reference: reference.trim() }, { onSuccess: handleClose });
  };

  return (
    <Modal open={open} onClose={handleClose} title='New sub-merchant' className='max-w-lg'>
      <div className='mt-2 space-y-4'>
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Acme Store' className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Reference</label>
          <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder='acme-store' className={inputClass} />
          <p className='mt-1 text-[11px] text-xental-text-primary-400'>A unique identifier you’ll use to attach virtual accounts to this sub-merchant.</p>
        </div>
        <div className='flex justify-end gap-2 pt-1'>
          <Button type='button' variant='outline' onClick={handleClose}>Cancel</Button>
          <Button type='button' onClick={handleCreate} disabled={create.isPending || !name.trim() || !reference.trim()}>
            {create.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
