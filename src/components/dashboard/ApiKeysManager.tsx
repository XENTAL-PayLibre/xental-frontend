'use client';

import { useState } from 'react';
import { Copy, KeyRound, Plus, RefreshCw, Trash2, MoreVertical, TriangleAlert, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useApiKeys, useCreateApiKey, useRotateApiKey, useRevokeApiKey } from '@/api/api-keys';
import { useOnboardingStatus } from '@/api/onboarding';
import type { ApiKey } from '@/api/types/api-keys';

function copy(text: string, label = 'Copied') {
  navigator.clipboard.writeText(text).then(() => toast.success(label));
}

function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className='mb-1 block text-xs text-xental-text-primary-400'>{label}</label>
      <div className='flex items-stretch gap-2'>
        <code className='min-w-0 flex-1 truncate rounded-lg border border-stroke-2 bg-xental-bg px-3 py-2 font-mono text-sm text-foreground'>{value}</code>
        <button onClick={() => copy(value)} className='shrink-0 rounded-lg border border-stroke-2 px-3 text-xental-text-primary-500 transition-colors hover:bg-xental-bg' aria-label='Copy'>
          <Copy className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}

function ModeBadge({ mode }: { mode: string }) {
  const live = mode.toLowerCase() === 'live';
  return <span className={cn('inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase', live ? 'bg-success-surface text-success-dark' : 'bg-action-blue-surface text-action-blue')}>{mode}</span>;
}

export default function ApiKeysManager() {
  const { data: keys, isLoading, isError } = useApiKeys();
  const { data: onboarding } = useOnboardingStatus();
  const create = useCreateApiKey();
  const rotate = useRotateApiKey();
  const revoke = useRevokeApiKey();

  const [createOpen, setCreateOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<'test' | 'live'>('test');
  const [reveal, setReveal] = useState<ApiKey | null>(null);
  const [confirm, setConfirm] = useState<{ kind: 'rotate' | 'revoke'; key: ApiKey } | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const canLive = onboarding?.canIssueLiveKeys ?? false;

  const submitCreate = () => {
    if (label.trim().length < 2) return toast.error('Label must be at least 2 characters.');
    create.mutate({ label: label.trim(), mode }, { onSuccess: (key) => { setCreateOpen(false); setLabel(''); setMode('test'); setReveal(key); } });
  };
  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === 'rotate') rotate.mutate(confirm.key.id, { onSuccess: (key) => { setConfirm(null); setReveal(key); } });
    else revoke.mutate(confirm.key.id, { onSuccess: () => setConfirm(null) });
  };

  return (
    <div>
      <h3 className='mb-3 text-sm font-semibold text-foreground'>API Keys</h3>

      {isLoading ? (
        <div className='rounded-xl border border-stroke-2 p-6 text-center text-sm text-xental-text-primary-400'>Loading keys…</div>
      ) : isError ? (
        <div className='rounded-xl border border-stroke-2 p-6 text-center text-sm text-failed'>Couldn’t load your API keys.</div>
      ) : !keys || keys.length === 0 ? (
        <div className='flex flex-col items-center gap-2 rounded-xl border border-stroke-2 p-8 text-center'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-action-blue-surface text-action-blue'><KeyRound className='h-4.5 w-4.5' /></div>
          <p className='text-sm font-medium text-foreground'>No API keys yet</p>
          <p className='max-w-xs text-xs text-xental-text-primary-500'>Create a test key to start building. The client secret is shown once.</p>
        </div>
      ) : (
        <div className='divide-y divide-stroke-2 overflow-hidden rounded-xl border border-stroke-2 bg-white'>
          {keys.map((k) => {
            const active = k.status.toLowerCase() === 'active';
            return (
              <div key={k.id} className='flex items-center justify-between gap-3 px-4 py-3'>
                <div className='flex min-w-0 items-center gap-2'>
                  <span className='truncate text-sm font-medium text-foreground'>{k.label}</span>
                  <ModeBadge mode={k.mode} />
                  {!active && <span className='shrink-0 rounded bg-failed-surface px-1.5 py-0.5 text-[10px] font-medium uppercase text-failed'>{k.status}</span>}
                </div>
                <div className='flex shrink-0 items-center gap-3'>
                  <button onClick={() => copy(k.clientId, 'Client ID copied')} title='Copy client ID' className='hidden max-w-[180px] truncate font-mono text-xs text-xental-text-primary-400 hover:text-foreground sm:inline'>
                    {k.clientId}
                  </button>
                  {active && (
                    <>
                      <button onClick={() => setConfirm({ kind: 'revoke', key: k })} title='Revoke' className='text-xental-text-primary-400 transition-colors hover:text-failed'>
                        <Trash2 className='h-3.5 w-3.5' />
                      </button>
                      <div className='relative'>
                        <button onClick={() => setMenuId((v) => (v === k.id ? null : k.id))} className='text-xental-text-primary-400 hover:text-foreground'>
                          <MoreVertical className='h-3.5 w-3.5' />
                        </button>
                        {menuId === k.id && (
                          <>
                            <button className='fixed inset-0 z-10 cursor-default' aria-hidden onClick={() => setMenuId(null)} />
                            <div className='absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-stroke-2 bg-white py-1 shadow-lg'>
                              <button onClick={() => { setMenuId(null); copy(k.clientId, 'Client ID copied'); }} className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-xental-text-primary-500 hover:bg-xental-bg'>
                                <Copy className='h-3.5 w-3.5' /> Copy client ID
                              </button>
                              <button onClick={() => { setMenuId(null); setConfirm({ kind: 'rotate', key: k }); }} className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-xental-text-primary-500 hover:bg-xental-bg'>
                                <RefreshCw className='h-3.5 w-3.5' /> Rotate key
                              </button>
                              <button onClick={() => { setMenuId(null); setConfirm({ kind: 'revoke', key: k }); }} className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-failed hover:bg-failed-surface'>
                                <Trash2 className='h-3.5 w-3.5' /> Revoke key
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button size='sm' className='mt-3' onClick={() => setCreateOpen(true)}>
        <Plus className='mr-1.5 h-3.5 w-3.5' /> Create API Key
      </Button>

      {/* Create */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title='Create API key'>
        <div className='space-y-4'>
          <div>
            <label className='mb-1 block text-xs text-xental-text-primary-400'>Label</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder='e.g. server-prod' className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue' />
          </div>
          <div>
            <label className='mb-1.5 block text-xs text-xental-text-primary-400'>Mode</label>
            <div className='grid grid-cols-2 gap-2'>
              {(['test', 'live'] as const).map((m) => {
                const disabled = m === 'live' && !canLive;
                return (
                  <button key={m} disabled={disabled} onClick={() => setMode(m)} className={cn('rounded-lg border px-3 py-2 text-sm capitalize transition-colors', mode === m ? 'border-action-blue bg-action-blue-surface text-action-blue' : 'border-stroke-2 text-xental-text-primary-500 hover:bg-xental-bg', disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent')}>{m}</button>
                );
              })}
            </div>
            {!canLive && <p className='mt-1.5 text-xs text-xental-text-primary-400'>Live keys unlock after your onboarding is approved.</p>}
          </div>
          <div className='flex justify-end gap-2 pt-1'>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={submitCreate} disabled={create.isPending}>{create.isPending ? 'Creating…' : 'Create key'}</Button>
          </div>
        </div>
      </Modal>

      {/* Reveal once */}
      <Modal open={!!reveal} onClose={() => setReveal(null)} title='Save your API key' className='max-w-lg'>
        {reveal && (
          <div className='space-y-4'>
            <div className='flex items-start gap-2.5 rounded-lg border border-[#f5d9a8] bg-[#fff7ed] p-3'>
              <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0 text-status-pending-1' />
              <p className='text-sm text-xental-text-primary-900'>The <strong>client secret is shown only once</strong>. Copy and store it securely now — rotate the key if you lose it.</p>
            </div>
            <CopyField label='Client ID' value={reveal.clientId} />
            <CopyField label='Client secret' value={reveal.clientSecret ?? ''} />
            <div className='flex justify-end pt-1'><Button onClick={() => setReveal(null)}><Check className='mr-1.5 h-4 w-4' /> I’ve saved it</Button></div>
          </div>
        )}
      </Modal>

      {/* Confirm */}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.kind === 'rotate' ? 'Rotate API key' : 'Revoke API key'}>
        {confirm && (
          <div className='space-y-4'>
            <p className='text-sm text-xental-text-primary-500'>
              {confirm.kind === 'rotate'
                ? <>This revokes <strong className='text-foreground'>{confirm.key.label}</strong> and issues a fresh key with a new secret.</>
                : <>This permanently revokes <strong className='text-foreground'>{confirm.key.label}</strong>. This can’t be undone.</>}
            </p>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setConfirm(null)}>Cancel</Button>
              <Button variant={confirm.kind === 'revoke' ? 'destructive' : 'default'} onClick={doConfirm} disabled={rotate.isPending || revoke.isPending}>
                {confirm.kind === 'rotate' ? (rotate.isPending ? 'Rotating…' : 'Rotate key') : (revoke.isPending ? 'Revoking…' : 'Revoke key')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
