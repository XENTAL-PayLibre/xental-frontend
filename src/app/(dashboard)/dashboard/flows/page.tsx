'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import { cn, koboToNaira, formatDate } from '@/lib/utils';
import { useFlows, useFlowRuns, useSetFlowEnabled, useDeleteFlow } from '@/api/flows';
import { FlowBuilderModal } from '@/components/dashboard/flows/FlowBuilderModal';
import type { FlowResponse } from '@/api/types/dashboard';

const TRIGGER_LABEL: Record<string, string> = {
  Deposit: 'Any deposit',
  Overpaid: 'Overpayment',
  Underpaid: 'Underpayment',
  FullyPaid: 'Fully paid',
  HighRisk: 'High risk',
};
const ACTION_LABEL: Record<string, string> = {
  Hold: 'Hold funds',
  Release: 'Release hold',
  NotifyWebhook: 'Notify',
  ReviewFlag: 'Flag for review',
};

function conditionText(f: FlowResponse) {
  const parts: string[] = [];
  if (f.minAmountKobo != null) parts.push(`≥ ${koboToNaira(f.minAmountKobo)}`);
  if (f.minRiskScore != null) parts.push(`risk ≥ ${f.minRiskScore}`);
  return parts.length ? parts.join(', ') : '—';
}

export default function FlowsPage() {
  const { data: flows = [], isLoading } = useFlows();
  const { data: runs = [] } = useFlowRuns();
  const setEnabled = useSetFlowEnabled();
  const remove = useDeleteFlow();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FlowResponse | null>(null);

  const enabledCount = flows.filter((f) => f.enabled).length;

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (f: FlowResponse) => { setEditing(f); setOpen(true); };

  return (
    <div className='flex flex-col gap-8 h-full'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div>
          <h1 className='text-[22px] font-bold text-foreground'>Flows</h1>
          <p className='text-sm text-xental-text-primary-400 mt-0.5'>
            Programmable automation that runs on every reconciled deposit — no code
          </p>
        </div>
        <Button onClick={openNew} className='gap-1.5 bg-action-blue hover:bg-action-blue/90'>
          <Plus className='w-4 h-4' /> New flow
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatCard label='Flows' value={String(flows.length)} icon='/images/dashboard/pay-in.svg' />
        <StatCard label='Active' value={String(enabledCount)} icon='/images/dashboard/successful.svg' />
        <StatCard label='Recent runs' value={String(runs.length)} icon='/images/dashboard/failed.svg' />
      </div>

      {/* Flows */}
      <div className='bg-white rounded-[12px] px-4 py-4'>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs min-w-[720px]'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Flow</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>When → Then</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Conditions</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Priority</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Status</th>
                <th className='text-right px-4 py-3 font-semibold text-foreground'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className='py-10 text-center text-xental-text-primary-400'>Loading flows...</td></tr>
              ) : flows.length === 0 ? (
                <tr><td colSpan={6} className='py-12 text-center text-xental-text-primary-400'>
                  <Zap className='w-6 h-6 mx-auto mb-2 opacity-40' />
                  No flows yet — create one to automate holds, releases and alerts on incoming payments.
                </td></tr>
              ) : (
                flows.map((f) => (
                  <tr key={f.id} className='border-b border-stroke-2/50 last:border-0 hover:bg-xental-bg transition-colors'>
                    <td className='px-4 py-3.5 text-foreground font-medium'>{f.name}</td>
                    <td className='px-4 py-3.5'>
                      <div className='flex flex-wrap items-center gap-1'>
                        <span className='rounded-md bg-purple-50 text-purple-600 px-2 py-0.5 text-[11px] font-medium'>{TRIGGER_LABEL[f.trigger] ?? f.trigger}</span>
                        <ArrowRight className='w-3 h-3 text-xental-text-primary-400' />
                        {f.actions.map((a, i) => (
                          <span key={i} className='rounded-md bg-action-blue-surface text-action-blue px-2 py-0.5 text-[11px] font-medium'>{ACTION_LABEL[a] ?? a}</span>
                        ))}
                      </div>
                    </td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{conditionText(f)}</td>
                    <td className='px-4 py-3.5 text-xental-text-primary-500'>{f.priority}</td>
                    <td className='px-4 py-3.5'>
                      <button
                        type='button'
                        onClick={() => setEnabled.mutate({ id: f.id, enabled: !f.enabled })}
                        disabled={setEnabled.isPending}
                        className={cn(
                          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                          f.enabled ? 'bg-success' : 'bg-stroke-2'
                        )}
                        aria-label={f.enabled ? 'Disable flow' : 'Enable flow'}
                      >
                        <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', f.enabled ? 'translate-x-4' : 'translate-x-0.5')} />
                      </button>
                    </td>
                    <td className='px-4 py-3.5 text-right'>
                      <div className='inline-flex items-center gap-3'>
                        <button type='button' onClick={() => openEdit(f)} className='text-action-blue hover:opacity-80' aria-label='Edit'>
                          <Pencil className='w-3.5 h-3.5' />
                        </button>
                        <button type='button' onClick={() => window.confirm(`Delete flow "${f.name}"?`) && remove.mutate(f.id)} disabled={remove.isPending} className='text-destructive hover:opacity-80' aria-label='Delete'>
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent runs (audit trail) */}
      <div className='bg-white rounded-[12px] px-4 py-4 flex-1'>
        <h3 className='text-sm font-semibold text-foreground mb-3 px-1'>Recent runs</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs min-w-[640px]'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Flow</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Trigger</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Account</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>Outcome</th>
                <th className='text-left px-4 py-3 font-semibold text-foreground'>When</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr><td colSpan={5} className='py-10 text-center text-xental-text-primary-400'>No runs yet</td></tr>
              ) : (
                runs.map((r) => (
                  <tr key={r.id} className='border-b border-stroke-2/50 last:border-0'>
                    <td className='px-4 py-3 text-foreground font-medium'>{r.flowName}</td>
                    <td className='px-4 py-3 text-xental-text-primary-500'>{TRIGGER_LABEL[r.trigger] ?? r.trigger}</td>
                    <td className='px-4 py-3 text-xental-text-primary-500'>{r.accountRef ?? '—'}</td>
                    <td className='px-4 py-3 text-xental-text-primary-500'>{r.outcome}</td>
                    <td className='px-4 py-3 text-xental-text-primary-400'>{formatDate(r.createdAtUtc)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FlowBuilderModal open={open} onClose={() => setOpen(false)} flow={editing} />
    </div>
  );
}
