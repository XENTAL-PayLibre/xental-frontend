'use client';

import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

export type CredentialField = { label: string; value: string; secret?: boolean };

export type Credential = {
  title: string;
  description?: string;
  fields: CredentialField[];
};

interface CredentialModalProps {
  credential: Credential | null;
  onClose: () => void;
}

export function CredentialModal({ credential, onClose }: CredentialModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    });
  };

  return (
    <Modal open={!!credential} onClose={onClose} title={credential?.title ?? ''} className='max-w-lg'>
      {credential && (
        <div className='mt-2 space-y-4'>
          <div className='flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5'>
            <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0 text-amber-600' />
            <p className='text-xs text-amber-800'>
              {credential.description ??
                'Copy these credentials now — the secret is shown once and cannot be retrieved again.'}
            </p>
          </div>

          <div className='space-y-3'>
            {credential.fields.map((f) => (
              <div key={f.label}>
                <label className='mb-1 block text-[11px] font-medium uppercase tracking-wide text-xental-text-primary-400'>
                  {f.label}
                </label>
                <div className='flex items-stretch gap-2'>
                  <code className='min-w-0 flex-1 truncate rounded-lg border border-stroke-2 bg-xental-bg px-3 py-2 font-mono text-xs text-foreground'>
                    {f.value}
                  </code>
                  <button
                    type='button'
                    onClick={() => copy(f.label, f.value)}
                    className='shrink-0 inline-flex items-center gap-1 rounded-lg border border-stroke-2 px-3 text-xs text-action-blue hover:bg-action-blue/5'
                  >
                    {copied === f.label ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                    {copied === f.label ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-end pt-1'>
            <Button type='button' onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
