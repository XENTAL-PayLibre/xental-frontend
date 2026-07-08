'use client';

import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn, koboToNaira } from '@/lib/utils';
import { CredentialModal, type Credential } from '@/components/dashboard/CredentialModal';
import type { AxiosError } from 'axios';

function apiError(err: unknown, fallback: string): string {
  const data = (err as AxiosError<{ detail?: string; title?: string }>)?.response?.data;
  return data?.detail ?? data?.title ?? fallback;
}
import {
  useProfile,
  useApiKeys,
  useCreateApiKey,
  useRotateApiKey,
  useDeleteApiKey,
  useWebhookEndpoints,
  useCreateWebhook,
  useDeleteWebhook,
  useWebhookDeliveries,
  useReplayDelivery,
  useChangePassword,
} from '@/api/dashboard';
import {
  useTeam,
  useInviteTeamMember,
  useUpdateTeamMember,
  useRemoveTeamMember,
  useResendInvite,
  type TeamMember,
  type TeamRole,
} from '@/api/team';
import { useSettlementConfig, useUpdateSettlementConfig, useSplits, useSetSplits } from '@/api/settlement';
import { useRules, useCreateRule, useDeleteRule } from '@/api/rules';
import { useBankLookup, useBanks } from '@/api/transfers';
import type { SplitLegInput } from '@/api/types/dashboard';

type Tab = 'Profile' | 'Team' | 'Developers' | 'Settlement' | 'Splits' | 'Security';
const TABS: Tab[] = ['Profile', 'Team', 'Developers', 'Settlement', 'Splits', 'Security'];

const ROLES: TeamRole[] = ['Admin', 'Employee', 'Developer'];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className='flex items-center gap-1 border border-stroke-2 rounded-lg p-1 w-full sm:w-fit mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide'>
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'px-3 py-1 text-xs rounded-md transition-colors shrink-0',
            active === t ? 'bg-white shadow-sm font-medium text-foreground border border-stroke-2' : 'text-xental-text-primary-400 hover:text-foreground'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function InputField({ label, value, onChange, onBlur, disabled, placeholder }: { label: string; value: string; onChange?: (v: string) => void; onBlur?: () => void; disabled?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className='block text-xs text-xental-text-primary-400 mb-1'>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'w-full border border-stroke-2 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none transition-colors',
          disabled ? 'bg-xental-bg text-xental-text-primary-400 cursor-default' : 'bg-white focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
        )}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className='block text-xs text-xental-text-primary-400 mb-1'>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full border border-stroke-2 rounded-lg px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ProfileTab() {
  const { data: profile } = useProfile();

  const [form, setForm] = useState({
    name: '',
    email: '',
    status: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        status: profile.status ?? '',
      });
    }
  }, [profile]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => toast.info('Profile editing is not yet supported by the API — coming soon');

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <InputField label='Full name' value={form.name} onChange={set('name')} />
        <InputField label='Email' value={form.email} disabled />
        <InputField label='Account status' value={form.status} disabled />
      </div>
      <div className='mt-6 flex justify-end'>
        <Button size='sm' onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}

function TeamTab() {
  const { data: members = [], isLoading } = useTeam();
  const invite = useInviteTeamMember();
  const update = useUpdateTeamMember();
  const remove = useRemoveTeamMember();
  const resend = useResendInvite();

  // 'list' | 'add' | { editId } — the add/edit form reuses one shape.
  const [mode, setMode] = useState<'list' | 'add' | { editId: string }>('list');
  const [form, setForm] = useState<{ name: string; email: string; role: TeamRole }>({ name: '', email: '', role: 'Employee' });

  const busy = invite.isPending || update.isPending || remove.isPending;

  function startAdd() { setForm({ name: '', email: '', role: 'Employee' }); setMode('add'); }
  function startEdit(m: TeamMember) { setForm({ name: m.name, email: m.email, role: m.role }); setMode({ editId: m.id }); }

  function handleSubmit() {
    if (mode === 'add') {
      invite.mutate(form, { onSuccess: () => setMode('list') });
    } else if (typeof mode === 'object') {
      update.mutate({ id: mode.editId, input: form }, { onSuccess: () => setMode('list') });
    }
  }

  function handleDelete(id: string) {
    remove.mutate(id, { onSuccess: () => setMode('list') });
  }

  if (mode === 'add' || typeof mode === 'object') {
    const editId = typeof mode === 'object' ? mode.editId : null;
    return (
      <div>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6'>
          <h3 className='text-sm font-semibold text-foreground'>{editId ? 'Edit team member' : 'Add team member'}</h3>
          <div className='flex flex-wrap items-center gap-2'>
            {editId && (
              <Button size='sm' variant='outline' className='text-destructive border-destructive hover:bg-red-50' disabled={busy} onClick={() => handleDelete(editId)}>
                <Trash2 className='w-3.5 h-3.5 mr-1.5' /> {remove.isPending ? 'Removing…' : 'Delete'}
              </Button>
            )}
            <Button size='sm' variant='outline' disabled={busy} onClick={() => setMode('list')}>Cancel</Button>
            <Button size='sm' disabled={busy || !form.name.trim() || !form.email.trim()} onClick={handleSubmit}>
              {editId ? (update.isPending ? 'Saving…' : 'Save changes') : (invite.isPending ? 'Sending…' : 'Send invite')}
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InputField label='Full name' value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <InputField label='Email' value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} disabled={!!editId} />
          <SelectField label='Role' value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v as TeamRole }))} options={ROLES} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-foreground'>Team members</h3>
        <Button size='sm' onClick={startAdd}>
          <Plus className='w-3.5 h-3.5 mr-1.5' /> Add team member
        </Button>
      </div>
      <div className='border border-stroke-2 rounded-xl overflow-x-auto'>
        <table className='w-full text-xs min-w-[500px]'>
          <thead>
            <tr className='border-b border-stroke-2 bg-xental-bg'>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Name</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Role</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Status</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date Added</th>
              <th className='px-4 py-3' />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className='px-4 py-6 text-center text-xental-text-primary-400'>Loading…</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} className='px-4 py-6 text-center text-xental-text-primary-400'>No team members yet. Invite one to get started.</td></tr>
            ) : members.map((m) => (
              <tr key={m.id} className='border-b border-stroke-2 last:border-0 bg-white'>
                <td className='px-4 py-3'>
                  <p className='font-medium text-foreground'>{m.name}</p>
                  <p className='text-xental-text-primary-400'>{m.email}</p>
                </td>
                <td className='px-4 py-3 text-xental-text-primary-500'>{m.role}</td>
                <td className='px-4 py-3'>
                  <span className='text-xental-text-primary-500'>{m.status}</span>
                  {m.status === 'Invited' && (
                    <button className='ml-2 text-action-blue hover:underline' disabled={resend.isPending} onClick={() => resend.mutate(m.id)}>Resend</button>
                  )}
                </td>
                <td className='px-4 py-3 text-xental-text-primary-500'>{new Date(m.createdAtUtc).toLocaleDateString()}</td>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3 justify-end'>
                    <button title='Edit' onClick={() => startEdit(m)}><Pencil className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-action-blue' /></button>
                    <button title='Remove' disabled={busy} onClick={() => handleDelete(m.id)}><Trash2 className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-destructive' /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DevelopersTab() {
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [newKeyMode, setNewKeyMode] = useState<'test' | 'live'>('test');
  const [credential, setCredential] = useState<Credential | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');

  const { data: apiKeys = [], isLoading: keysLoading } = useApiKeys();
  const { data: webhooks = [], isLoading: hooksLoading } = useWebhookEndpoints();
  const createKey = useCreateApiKey();
  const rotateKey = useRotateApiKey();
  const deleteKey = useDeleteApiKey();
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();

  function handleCopy(id: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success('Copied to clipboard');
  }

  async function handleCreateKey() {
    if (!newKeyLabel.trim()) { toast.error('Enter a label for the key'); return; }
    try {
      const res = await createKey.mutateAsync({ label: newKeyLabel.trim(), mode: newKeyMode });
      setNewKeyLabel('');
      setCredential({
        title: 'API key created',
        description: 'Copy your Client ID and Secret now — the secret is shown once and cannot be retrieved again.',
        fields: [
          { label: 'Client ID', value: res.clientId ?? '' },
          ...(res.clientSecret ? [{ label: 'Client Secret', value: res.clientSecret, secret: true }] : []),
        ],
      });
    } catch (err) { toast.error(apiError(err, 'Failed to create API key')); }
  }

  async function handleRotate(id: string) {
    try {
      const res = await rotateKey.mutateAsync(id);
      setCredential({
        title: 'API key rotated',
        description: 'The old secret is now invalid. Copy the new secret — it is shown once.',
        fields: [
          { label: 'Client ID', value: res.clientId ?? '' },
          ...(res.clientSecret ? [{ label: 'Client Secret', value: res.clientSecret, secret: true }] : []),
        ],
      });
    } catch (err) { toast.error(apiError(err, 'Failed to rotate key')); }
  }

  async function handleDeleteKey(id: string) {
    try {
      await deleteKey.mutateAsync(id);
      toast.success('API key deleted');
    } catch (err) { toast.error(apiError(err, 'Failed to delete key')); }
  }

  async function handleSaveWebhook() {
    if (!webhookUrl.trim()) { toast.error('Enter a webhook URL'); return; }
    try {
      const res = await createWebhook.mutateAsync(webhookUrl.trim());
      setWebhookUrl('');
      setCredential({
        title: 'Webhook added',
        description: 'Copy the signing secret now — use it to verify the HMAC-SHA256 signature on every delivery. It is shown once.',
        fields: [
          { label: 'Endpoint URL', value: res.url },
          { label: 'Signing Secret', value: res.signingSecret, secret: true },
        ],
      });
    } catch (err) { toast.error(apiError(err, 'Failed to save webhook')); }
  }

  async function handleDeleteWebhook(id: string) {
    try {
      await deleteWebhook.mutateAsync(id);
      toast.success('Webhook removed');
    } catch (err) { toast.error(apiError(err, 'Failed to remove webhook')); }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* API Keys */}
      <div>
        <h3 className='text-sm font-semibold text-foreground mb-3'>API Keys</h3>
        <div className='border border-stroke-2 rounded-xl overflow-hidden mb-3'>
          {keysLoading ? (
            <div className='px-4 py-4 text-xs text-xental-text-primary-400'>Loading...</div>
          ) : apiKeys.length === 0 ? (
            <div className='px-4 py-4 text-xs text-xental-text-primary-400'>No API keys yet. Create one below.</div>
          ) : apiKeys.map((key) => (
            <div key={key.id} className='flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-stroke-2 last:border-0'>
              <div className='min-w-0'>
                <p className='text-sm text-foreground font-medium truncate'>{key.label ?? 'Unnamed key'}</p>
                <p className='text-[10px] text-xental-text-primary-400 font-mono mt-0.5 truncate'>{key.clientId}</p>
              </div>
              <div className='flex items-center gap-2.5 sm:gap-3 shrink-0'>
                <span className={cn('hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-medium', key.status === 'Active' ? 'bg-green-50 text-success' : 'bg-xental-bg text-xental-text-primary-400')}>
                  {key.status ?? 'Active'}
                </span>
                <button onClick={() => handleCopy(key.id, key.clientId ?? '')} title='Copy Client ID'>
                  <Copy className={cn('w-3.5 h-3.5', copiedId === key.id ? 'text-success' : 'text-xental-text-primary-400 hover:text-action-blue')} />
                </button>
                <button onClick={() => handleRotate(key.id)} title='Rotate key' disabled={rotateKey.isPending}>
                  <RefreshCw className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-foreground' />
                </button>
                <button onClick={() => handleDeleteKey(key.id)} title='Delete key'>
                  <Trash2 className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-destructive' />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <input
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            placeholder='Key label (e.g. Production)'
            className='w-full sm:flex-1 border border-stroke-2 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
          />
          <select
            value={newKeyMode}
            onChange={(e) => setNewKeyMode(e.target.value as 'test' | 'live')}
            title='Live keys require an approved KYC/KYB onboarding'
            className='w-full sm:w-auto border border-stroke-2 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
          >
            <option value='test'>Test</option>
            <option value='live'>Live</option>
          </select>
          <Button size='sm' onClick={handleCreateKey} disabled={createKey.isPending} className='w-full sm:w-auto justify-center'>
            <Plus className='w-3.5 h-3.5 mr-1.5' /> {createKey.isPending ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>

      {/* Webhooks */}
      <div>
        <h3 className='text-sm font-semibold text-foreground mb-3'>Webhooks</h3>
        <div className='border border-stroke-2 rounded-xl overflow-hidden mb-3'>
          {hooksLoading ? (
            <div className='px-4 py-4 text-xs text-xental-text-primary-400'>Loading...</div>
          ) : webhooks.length === 0 ? (
            <div className='px-4 py-4 text-xs text-xental-text-primary-400'>No webhook endpoints yet.</div>
          ) : webhooks.map((wh) => (
            <div key={wh.id} className='flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-stroke-2 last:border-0'>
              <span className='min-w-0 flex-1 text-sm font-mono text-foreground truncate'>{wh.url}</span>
              <div className='flex items-center gap-2.5 sm:gap-3 shrink-0'>
                <span className={cn('hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-medium', wh.active ? 'bg-green-50 text-success' : 'bg-xental-bg text-xental-text-primary-400')}>
                  {wh.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => handleCopy(wh.id, wh.url ?? '')} title='Copy URL'>
                  <Copy className={cn('w-3.5 h-3.5', copiedId === wh.id ? 'text-success' : 'text-xental-text-primary-400 hover:text-action-blue')} />
                </button>
                <button onClick={() => handleDeleteWebhook(wh.id)} title='Remove'>
                  <Trash2 className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-destructive' />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder='https://yourdomain.com/webhook'
            className='w-full sm:flex-1 border border-stroke-2 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
          />
          <Button size='sm' onClick={handleSaveWebhook} disabled={createWebhook.isPending} className='w-full sm:w-auto justify-center'>
            <Plus className='w-3.5 h-3.5 mr-1.5' /> {createWebhook.isPending ? 'Saving...' : 'Add'}
          </Button>
        </div>
        <WebhookDeliveries />
      </div>

      <CredentialModal credential={credential} onClose={() => setCredential(null)} />
    </div>
  );
}

const DELIVERY_BADGE: Record<string, string> = {
  Delivered: 'bg-green-50 text-success',
  Succeeded: 'bg-green-50 text-success',
  Failed: 'bg-red-50 text-destructive',
  Pending: 'bg-orange-50 text-pending',
  Retrying: 'bg-orange-50 text-pending',
};

function WebhookDeliveries() {
  const { data: deliveries = [], isLoading } = useWebhookDeliveries();
  const replay = useReplayDelivery();

  return (
    <div className='mt-8 border-t border-stroke-2 pt-6'>
      <h3 className='text-sm font-semibold text-foreground mb-1'>Recent deliveries</h3>
      <p className='text-xs text-xental-text-primary-400 mb-4'>Outbound webhook attempts. Replay any delivery that failed.</p>
      <div className='overflow-x-auto'>
        <table className='w-full text-xs'>
          <thead>
            <tr className='border-b border-stroke-2'>
              <th className='text-left px-3 py-2 font-semibold text-foreground'>Event</th>
              <th className='text-left px-3 py-2 font-semibold text-foreground'>Status</th>
              <th className='text-left px-3 py-2 font-semibold text-foreground'>Attempts</th>
              <th className='text-left px-3 py-2 font-semibold text-foreground'>Last code</th>
              <th className='text-left px-3 py-2 font-semibold text-foreground'>Created</th>
              <th className='px-3 py-2 text-right font-semibold text-foreground'>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className='py-6 text-center text-xental-text-primary-400'>Loading deliveries...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr><td colSpan={6} className='py-6 text-center text-xental-text-primary-400'>No deliveries yet</td></tr>
            ) : (
              deliveries.map((d) => (
                <tr key={d.id} className='border-b border-stroke-2/50 last:border-0'>
                  <td className='px-3 py-2.5 text-foreground font-medium'>{d.eventType}</td>
                  <td className='px-3 py-2.5'>
                    <span className={cn('px-2 py-0.5 rounded-md text-[11px] font-medium', DELIVERY_BADGE[d.status] ?? 'bg-gray-50 text-gray-500')}>
                      {d.status}
                    </span>
                  </td>
                  <td className='px-3 py-2.5 text-xental-text-primary-500'>{d.attempts}</td>
                  <td className='px-3 py-2.5 text-xental-text-primary-500'>{d.lastStatusCode ?? '—'}</td>
                  <td className='px-3 py-2.5 text-xental-text-primary-500'>{new Date(d.createdAtUtc).toLocaleString()}</td>
                  <td className='px-3 py-2.5 text-right'>
                    <button type='button' onClick={() => replay.mutate(d.id)} disabled={replay.isPending} className='text-[11px] font-medium text-action-blue hover:opacity-80'>
                      Replay
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggleShow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <div>
      <label className='block text-xs text-xental-text-primary-400 mb-1'>{label}</label>
      <div className='relative'>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='••••••••'
          className='w-full border border-stroke-2 rounded-lg px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
        />
        <button type='button' onClick={onToggleShow} className='absolute right-3 top-1/2 -translate-y-1/2 text-xental-text-primary-400 hover:text-foreground'>
          {show ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const changePassword = useChangePassword();
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleShow = (k: keyof typeof show) => setShow((s) => ({ ...s, [k]: !s[k] }));

  const canSave = !!form.current && !!form.newPass && !!form.confirm && form.newPass === form.confirm;

  function handleSave() {
    if (form.newPass !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.newPass.length < 12) { toast.error('New password must be at least 12 characters'); return; }
    changePassword.mutate(
      { currentPassword: form.current, newPassword: form.newPass },
      { onSuccess: () => setForm({ current: '', newPass: '', confirm: '' }) }
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Change Password */}
      <div>
        <h3 className='text-sm font-semibold text-foreground mb-1'>Change Password</h3>
        <p className='text-xs text-xental-text-primary-400 mb-4'>Update your password to keep your account secure.</p>
        <div className='flex flex-col gap-4 max-w-md'>
          <PasswordField label='Current password' value={form.current} onChange={set('current')} show={show.current} onToggleShow={() => toggleShow('current')} />
          <PasswordField label='New password' value={form.newPass} onChange={set('newPass')} show={show.newPass} onToggleShow={() => toggleShow('newPass')} />
          <PasswordField label='Confirm new password' value={form.confirm} onChange={set('confirm')} show={show.confirm} onToggleShow={() => toggleShow('confirm')} />
          {form.newPass && form.confirm && form.newPass !== form.confirm && (
            <p className='text-xs text-destructive'>Passwords do not match</p>
          )}
          <div className='flex justify-end'>
            <Button size='sm' onClick={handleSave} disabled={!canSave || changePassword.isPending}>
              {changePassword.isPending ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const RULE_TRIGGERS = ['AnyDeposit', 'Overpaid', 'Underpaid', 'HighRisk', 'FullyPaid'];
const RULE_ACTIONS = ['Hold', 'Notify', 'ReviewFlag'];

function SettlementTab() {
  const { data: config, isLoading } = useSettlementConfig();
  const updateConfig = useUpdateSettlementConfig();
  const { data: rules = [] } = useRules();
  const createRule = useCreateRule();
  const deleteRule = useDeleteRule();
  const bankLookup = useBankLookup();
  const { data: banks = [] } = useBanks();

  const [form, setForm] = useState({ accountNumber: '', bankCode: '', accountName: '', autoSettle: 'Off', minPayout: '' });
  const [rule, setRule] = useState({ trigger: 'Overpaid', action: 'Hold', threshold: '', minRisk: '', priority: '1' });

  useEffect(() => {
    if (config) {
      setForm({
        accountNumber: config.settlementAccountNumber ?? '',
        bankCode: config.settlementBankCode ?? '',
        accountName: config.settlementAccountName ?? '',
        autoSettle: config.autoSettle ? 'On' : 'Off',
        minPayout: config.minPayoutKobo ? String(config.minPayoutKobo / 100) : '',
      });
    }
  }, [config]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-resolve the account holder name from account number + bank code.
  const resolve = (accountNumber: string, bankCode: string) => {
    if (accountNumber.trim().length < 10 || !bankCode.trim()) return;
    bankLookup.mutate(
      { accountNumber: accountNumber.trim(), bankCode: bankCode.trim() },
      { onSuccess: (res) => setForm((f) => ({ ...f, accountName: res.accountName })) }
    );
  };

  const onSelectBank = (code: string) => {
    setForm((f) => ({ ...f, bankCode: code, accountName: '' }));
    resolve(form.accountNumber, code);
  };

  const handleSaveConfig = () => {
    updateConfig.mutate({
      settlementAccountNumber: form.accountNumber || undefined,
      settlementBankCode: form.bankCode || undefined,
      settlementAccountName: form.accountName || undefined,
      autoSettle: form.autoSettle === 'On',
      minPayoutKobo: Math.round((parseFloat(form.minPayout) || 0) * 100),
    });
  };

  const handleAddRule = () => {
    createRule.mutate(
      {
        trigger: rule.trigger,
        action: rule.action,
        thresholdKobo: rule.threshold ? Math.round(parseFloat(rule.threshold) * 100) : undefined,
        minRiskScore: rule.minRisk ? parseInt(rule.minRisk) : undefined,
        priority: parseInt(rule.priority) || 1,
      },
      { onSuccess: () => setRule({ trigger: 'Overpaid', action: 'Hold', threshold: '', minRisk: '', priority: '1' }) }
    );
  };

  if (isLoading) return <div className='py-8 text-center text-xental-text-primary-400'>Loading settlement settings...</div>;

  return (
    <div className='flex flex-col gap-8'>
      {/* Settlement destination + auto-settle */}
      <div>
        <h3 className='text-sm font-semibold text-foreground mb-4'>Settlement account</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InputField label='Account number' value={form.accountNumber} onChange={set('accountNumber')} onBlur={() => resolve(form.accountNumber, form.bankCode)} placeholder='0123456789' />
          <div>
            <label className='block text-xs text-xental-text-primary-400 mb-1'>Bank</label>
            <select
              value={form.bankCode}
              onChange={(e) => onSelectBank(e.target.value)}
              className='w-full border border-stroke-2 rounded-lg px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
            >
              <option value=''>Select a bank…</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>{b.name}</option>
              ))}
            </select>
          </div>
          <InputField label='Account name' value={bankLookup.isPending ? 'Resolving…' : form.accountName} disabled placeholder='Auto-resolved from account + bank' />
          <InputField label='Minimum payout (₦)' value={form.minPayout} onChange={set('minPayout')} placeholder='0' />
          <SelectField label='Auto-settle' value={form.autoSettle} onChange={set('autoSettle')} options={['Off', 'On']} />
        </div>
        {config && !config.canAutoSettle && form.autoSettle === 'On' && (
          <p className='mt-2 text-xs text-pending'>Auto-settle needs an approved (live) account and a settlement destination.</p>
        )}
        <div className='mt-6 flex justify-end'>
          <Button size='sm' onClick={handleSaveConfig} disabled={updateConfig.isPending}>
            {updateConfig.isPending ? 'Saving...' : 'Save settings'}
          </Button>
        </div>
      </div>

      {/* Money rules */}
      <div className='border-t border-stroke-2 pt-6'>
        <h3 className='text-sm font-semibold text-foreground mb-1'>Reconciliation rules</h3>
        <p className='text-xs text-xental-text-primary-400 mb-4'>Automatically hold, flag, or notify on deposits that match a trigger.</p>

        <div className='overflow-x-auto mb-4'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b border-stroke-2'>
                <th className='text-left px-3 py-2 font-semibold text-foreground'>Trigger</th>
                <th className='text-left px-3 py-2 font-semibold text-foreground'>Action</th>
                <th className='text-left px-3 py-2 font-semibold text-foreground'>Threshold</th>
                <th className='text-left px-3 py-2 font-semibold text-foreground'>Min risk</th>
                <th className='text-left px-3 py-2 font-semibold text-foreground'>Priority</th>
                <th className='px-3 py-2 w-8' />
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr><td colSpan={6} className='py-6 text-center text-xental-text-primary-400'>No rules configured</td></tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.id} className='border-b border-stroke-2/50 last:border-0'>
                    <td className='px-3 py-2.5 text-foreground font-medium'>{r.trigger}</td>
                    <td className='px-3 py-2.5 text-xental-text-primary-500'>{r.action}</td>
                    <td className='px-3 py-2.5 text-xental-text-primary-500'>{r.thresholdKobo != null ? koboToNaira(r.thresholdKobo) : '—'}</td>
                    <td className='px-3 py-2.5 text-xental-text-primary-500'>{r.minRiskScore ?? '—'}</td>
                    <td className='px-3 py-2.5 text-xental-text-primary-500'>{r.priority}</td>
                    <td className='px-3 py-2.5 text-right'>
                      <button type='button' onClick={() => deleteRule.mutate(r.id)} disabled={deleteRule.isPending} className='text-destructive hover:opacity-80'>
                        <Trash2 className='w-3.5 h-3.5 inline-block' />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-5 gap-3 items-end'>
          <SelectField label='Trigger' value={rule.trigger} onChange={(v) => setRule((s) => ({ ...s, trigger: v }))} options={RULE_TRIGGERS} />
          <SelectField label='Action' value={rule.action} onChange={(v) => setRule((s) => ({ ...s, action: v }))} options={RULE_ACTIONS} />
          <InputField label='Threshold (₦)' value={rule.threshold} onChange={(v) => setRule((s) => ({ ...s, threshold: v }))} placeholder='optional' />
          <InputField label='Min risk' value={rule.minRisk} onChange={(v) => setRule((s) => ({ ...s, minRisk: v }))} placeholder='optional' />
          <div className='flex items-end gap-2'>
            <div className='flex-1'>
              <InputField label='Priority' value={rule.priority} onChange={(v) => setRule((s) => ({ ...s, priority: v }))} />
            </div>
            <Button size='sm' onClick={handleAddRule} disabled={createRule.isPending} className='gap-1'>
              <Plus className='w-3.5 h-3.5' /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type SplitRow = {
  beneficiaryName: string;
  accountNumber: string;
  bankCode: string;
  basis: 'Percentage' | 'Flat';
  percent: string;
  flatNaira: string;
  priority: string;
};

function SplitsTab() {
  const { data: splits = [], isLoading } = useSplits();
  const { data: banks = [] } = useBanks();
  const save = useSetSplits();
  const [rows, setRows] = useState<SplitRow[]>([]);

  useEffect(() => {
    setRows(
      splits.map((s) => ({
        beneficiaryName: s.beneficiaryName,
        accountNumber: s.accountNumber,
        bankCode: s.bankCode,
        basis: s.basis === 'Flat' ? 'Flat' : 'Percentage',
        percent: s.basis === 'Percentage' ? String(s.shareBps / 100) : '',
        flatNaira: s.basis === 'Flat' ? String(s.flatKobo / 100) : '',
        priority: String(s.priority),
      }))
    );
  }, [splits]);

  const addRow = () =>
    setRows((r) => [
      ...r,
      { beneficiaryName: '', accountNumber: '', bankCode: '', basis: 'Percentage', percent: '', flatNaira: '', priority: String(r.length + 1) },
    ]);
  const removeRow = (i: number) => setRows((r) => r.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<SplitRow>) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const totalPct = rows.filter((r) => r.basis === 'Percentage').reduce((s, r) => s + (parseFloat(r.percent) || 0), 0);

  const handleSave = () => {
    const payload: SplitLegInput[] = rows.map((row) => ({
      beneficiaryName: row.beneficiaryName.trim(),
      accountNumber: row.accountNumber.trim(),
      bankCode: row.bankCode.trim(),
      basis: row.basis,
      shareBps: row.basis === 'Percentage' ? Math.round((parseFloat(row.percent) || 0) * 100) : 0,
      flatKobo: row.basis === 'Flat' ? Math.round((parseFloat(row.flatNaira) || 0) * 100) : 0,
      priority: parseInt(row.priority) || 0,
    }));
    save.mutate(payload);
  };

  if (isLoading) return <div className='py-8 text-center text-xental-text-primary-400'>Loading split rules...</div>;

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h3 className='text-sm font-semibold text-foreground'>Split settlement</h3>
        <p className='text-xs text-xental-text-primary-400 mt-1'>
          Route each settlement across multiple beneficiaries. Percentage legs share the amount pro-rata; flat legs take a fixed amount first, by priority. Saving replaces all existing legs.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className='rounded-lg border border-dashed border-stroke-2 py-8 text-center text-xs text-xental-text-primary-400'>
          No split rules — settlements go to your main settlement account.
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {rows.map((row, i) => (
            <div key={i} className='rounded-lg border border-stroke-2 p-4'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-xs font-semibold text-foreground'>Beneficiary {i + 1}</span>
                <button type='button' onClick={() => removeRow(i)} className='text-destructive hover:opacity-80' title='Remove'>
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <InputField label='Beneficiary name' value={row.beneficiaryName} onChange={(v) => update(i, { beneficiaryName: v })} />
                <InputField label='Account number' value={row.accountNumber} onChange={(v) => update(i, { accountNumber: v })} />
                <div>
                  <label className='block text-xs text-xental-text-primary-400 mb-1'>Bank</label>
                  <select
                    value={row.bankCode}
                    onChange={(e) => update(i, { bankCode: e.target.value })}
                    className='w-full border border-stroke-2 rounded-lg px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
                  >
                    <option value=''>Select a bank…</option>
                    {banks.map((b) => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <SelectField label='Basis' value={row.basis} onChange={(v) => update(i, { basis: v as 'Percentage' | 'Flat' })} options={['Percentage', 'Flat']} />
                {row.basis === 'Percentage' ? (
                  <InputField label='Share (%)' value={row.percent} onChange={(v) => update(i, { percent: v })} placeholder='e.g. 30' />
                ) : (
                  <InputField label='Flat amount (₦)' value={row.flatNaira} onChange={(v) => update(i, { flatNaira: v })} placeholder='0' />
                )}
                <InputField label='Priority' value={row.priority} onChange={(v) => update(i, { priority: v })} />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPct > 100 && (
        <p className='text-xs text-destructive'>Percentage legs add up to {totalPct}% — they must not exceed 100%.</p>
      )}

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <Button size='sm' variant='outline' onClick={addRow} className='gap-1 w-full sm:w-auto justify-center'>
          <Plus className='w-3.5 h-3.5' /> Add beneficiary
        </Button>
        <Button size='sm' onClick={handleSave} disabled={save.isPending || totalPct > 100} className='w-full sm:w-auto justify-center'>
          {save.isPending ? 'Saving...' : 'Save split rules'}
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Profile');

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className='text-xl font-bold text-foreground'>Settings</h1>
        <p className='text-sm text-xental-text-primary-400 mt-0.5'>Manage your account preferences</p>
      </div>

      <div className='bg-white rounded-xl border border-stroke-2 p-4 sm:p-6 overflow-x-hidden'>
        <TabBar active={tab} onChange={setTab} />
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Team' && <TeamTab />}
        {tab === 'Developers' && <DevelopersTab />}
        {tab === 'Settlement' && <SettlementTab />}
        {tab === 'Splits' && <SplitsTab />}
        {tab === 'Security' && <SecurityTab />}
      </div>
    </div>
  );
}
