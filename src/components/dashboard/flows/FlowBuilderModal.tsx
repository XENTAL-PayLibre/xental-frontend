'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight, Plus } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCreateFlow, useUpdateFlow } from '@/api/flows';
import type { FlowResponse } from '@/api/types/dashboard';

const TRIGGERS: { value: string; label: string; hint: string }[] = [
  { value: 'Deposit', label: 'Any deposit', hint: 'Fires on every reconciled inflow' },
  { value: 'Overpaid', label: 'Overpayment', hint: 'Customer paid more than expected' },
  { value: 'Underpaid', label: 'Underpayment', hint: 'Customer paid less than expected' },
  { value: 'FullyPaid', label: 'Fully paid', hint: 'Expected amount fully settled' },
  { value: 'HighRisk', label: 'High risk', hint: 'Flagged for review or over the risk gate' },
];

const ACTIONS: { value: string; label: string; hint: string }[] = [
  { value: 'Hold', label: 'Hold funds', hint: 'Place the balance in escrow' },
  { value: 'Release', label: 'Release hold', hint: 'Release an active escrow hold' },
  { value: 'NotifyWebhook', label: 'Notify', hint: 'Emit a flow.notify webhook event' },
  { value: 'ReviewFlag', label: 'Flag for review', hint: 'Emit a flow.review_flag event' },
];

const actionLabel = (v: string) => ACTIONS.find((a) => a.value === v)?.label ?? v;

interface FlowBuilderModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal edits this flow instead of creating a new one. */
  flow?: FlowResponse | null;
}

export function FlowBuilderModal({ open, onClose, flow }: FlowBuilderModalProps) {
  const create = useCreateFlow();
  const update = useUpdateFlow();
  const saving = create.isPending || update.isPending;

  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Overpaid');
  const [actions, setActions] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState('');
  const [minRisk, setMinRisk] = useState('');
  const [priority, setPriority] = useState('1');

  // Load the editing flow (or reset to defaults) whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setName(flow?.name ?? '');
    setTrigger(flow?.trigger ?? 'Overpaid');
    setActions(flow?.actions ?? []);
    setMinAmount(flow?.minAmountKobo != null ? String(flow.minAmountKobo / 100) : '');
    setMinRisk(flow?.minRiskScore != null ? String(flow.minRiskScore) : '');
    setPriority(String(flow?.priority ?? 1));
  }, [open, flow]);

  const inputClass =
    'w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue bg-transparent text-foreground';

  const addAction = (v: string) => setActions((s) => [...s, v]);
  const removeAction = (i: number) => setActions((s) => s.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!name.trim() || actions.length === 0) return;
    const payload = {
      name: name.trim(),
      trigger,
      actions,
      minAmountKobo: minAmount ? Math.round(parseFloat(minAmount) * 100) : undefined,
      minRiskScore: minRisk ? parseInt(minRisk) : undefined,
      priority: parseInt(priority) || 1,
    };
    if (flow) {
      update.mutate({ id: flow.id, ...payload }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={flow ? 'Edit flow' : 'New payment flow'} className='max-w-xl'>
      <div className='mt-2 space-y-4'>
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Flow name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Hold overpayments for review' className={inputClass} />
        </div>

        {/* WHEN */}
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>When</label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {TRIGGERS.map((t) => (
              <button
                key={t.value}
                type='button'
                onClick={() => setTrigger(t.value)}
                className={cn(
                  'text-left rounded-lg border px-3 py-2 transition-colors',
                  trigger === t.value ? 'border-action-blue bg-action-blue-surface' : 'border-stroke-2 hover:bg-xental-bg'
                )}
              >
                <p className='text-xs font-semibold text-foreground'>{t.label}</p>
                <p className='text-[11px] text-xental-text-primary-400 mt-0.5'>{t.hint}</p>
              </button>
            ))}
          </div>
        </div>

        {/* THEN — ordered actions */}
        <div>
          <label className='mb-1 block text-xs font-medium text-foreground'>Then, in order</label>
          {actions.length > 0 && (
            <div className='flex flex-wrap items-center gap-1.5 mb-2'>
              {actions.map((a, i) => (
                <span key={`${a}-${i}`} className='inline-flex items-center gap-1'>
                  <span className='inline-flex items-center gap-1 rounded-md bg-action-blue-surface text-action-blue text-[11px] font-medium px-2 py-1'>
                    <span className='opacity-60'>{i + 1}.</span> {actionLabel(a)}
                    <button type='button' onClick={() => removeAction(i)} className='hover:opacity-70'>
                      <X className='w-3 h-3' />
                    </button>
                  </span>
                  {i < actions.length - 1 && <ArrowRight className='w-3 h-3 text-xental-text-primary-400' />}
                </span>
              ))}
            </div>
          )}
          <div className='flex flex-wrap gap-1.5'>
            {ACTIONS.map((a) => (
              <button
                key={a.value}
                type='button'
                onClick={() => addAction(a.value)}
                title={a.hint}
                className='inline-flex items-center gap-1 rounded-md border border-stroke-2 text-[11px] font-medium px-2 py-1 text-xental-text-primary-500 hover:bg-xental-bg'
              >
                <Plus className='w-3 h-3' /> {a.label}
              </button>
            ))}
          </div>
          {actions.length === 0 && (
            <p className='text-[11px] text-xental-text-primary-400 mt-1.5'>Add at least one action. Click an action to append it to the sequence.</p>
          )}
        </div>

        {/* CONDITIONS */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Min amount (₦)</label>
            <input type='number' min='0' step='0.01' value={minAmount} onChange={(e) => setMinAmount(e.target.value)} placeholder='any' className={inputClass} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Min risk (0–100)</label>
            <input type='number' min='0' max='100' value={minRisk} onChange={(e) => setMinRisk(e.target.value)} placeholder='any' className={inputClass} />
          </div>
          <div>
            <label className='mb-1 block text-xs font-medium text-foreground'>Priority</label>
            <input type='number' min='1' value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className='flex justify-end gap-2 pt-1'>
          <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
          <Button type='button' onClick={handleSave} disabled={saving || !name.trim() || actions.length === 0}>
            {saving ? 'Saving...' : flow ? 'Save changes' : 'Create flow'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
