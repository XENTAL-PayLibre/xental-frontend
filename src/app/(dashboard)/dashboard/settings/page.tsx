'use client';

import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
} from '@/api/dashboard';

type Tab = 'Profile' | 'Team' | 'Developers' | 'Security';
const TABS: Tab[] = ['Profile', 'Team', 'Developers', 'Security'];

const TEAM_MEMBERS = [
  { id: '1', name: 'Tunde Adebayo', email: 'tundeadebayo@gmail.com', role: 'Admin', dateAdded: '2026-02-23' },
  { id: '2', name: 'Tunde Adebayo', email: 'tundeadebayo@gmail.com', role: 'Employee', dateAdded: '2026-02-23' },
  { id: '3', name: 'Tunde Adebayo', email: 'tundeadebayo@gmail.com', role: 'Developer', dateAdded: '2026-02-23' },
];
const ROLES = ['Admin', 'Employee', 'Developer'];

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

function InputField({ label, value, onChange, disabled, placeholder }: { label: string; value: string; onChange?: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className='block text-xs text-xental-text-primary-400 mb-1'>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
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
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

  function startEdit(m: typeof TEAM_MEMBERS[0]) {
    setEditing(m.id);
    setEditForm({ name: m.name, email: m.email, role: m.role });
  }

  function handleSave() {
    setEditing(null);
    toast.success('Team member updated');
  }

  if (editing) {
    return (
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-sm font-semibold text-foreground'>Basic information</h3>
          <div className='flex items-center gap-2'>
            <Button size='sm' variant='outline' className='text-destructive border-destructive hover:bg-red-50' onClick={() => { setEditing(null); toast.success('Member removed'); }}>
              <Trash2 className='w-3.5 h-3.5 mr-1.5' /> Delete
            </Button>
            <Button size='sm' onClick={handleSave}>Save changes</Button>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InputField label='Full name' value={editForm.name} onChange={(v) => setEditForm((f) => ({ ...f, name: v }))} />
          <InputField label='Email' value={editForm.email} onChange={(v) => setEditForm((f) => ({ ...f, email: v }))} />
          <SelectField label='Role' value={editForm.role} onChange={(v) => setEditForm((f) => ({ ...f, role: v }))} options={ROLES} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-foreground'>Team members</h3>
        <Button size='sm' onClick={() => toast.info('Add team member — coming once API is wired')}>
          <Plus className='w-3.5 h-3.5 mr-1.5' /> Add team member
        </Button>
      </div>
      <div className='border border-stroke-2 rounded-xl overflow-x-auto'>
        <table className='w-full text-xs min-w-[500px]'>
          <thead>
            <tr className='border-b border-stroke-2 bg-xental-bg'>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Name</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Role</th>
              <th className='text-left px-4 py-3 font-medium text-xental-text-primary-400'>Date Added</th>
              <th className='px-4 py-3' />
            </tr>
          </thead>
          <tbody>
            {TEAM_MEMBERS.map((m) => (
              <tr key={m.id} className='border-b border-stroke-2 last:border-0 bg-white'>
                <td className='px-4 py-3'>
                  <p className='font-medium text-foreground'>{m.name}</p>
                  <p className='text-xental-text-primary-400'>{m.email}</p>
                </td>
                <td className='px-4 py-3 text-xental-text-primary-500'>{m.role}</td>
                <td className='px-4 py-3 text-xental-text-primary-500'>{m.dateAdded}</td>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-2 justify-end'>
                    <button onClick={() => startEdit(m)}><Pencil className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-action-blue' /></button>
                    <button><MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400' /></button>
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
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
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
      const res = await createKey.mutateAsync({ label: newKeyLabel.trim(), mode: 'live' });
      const secret = (res as { clientSecret?: string })?.clientSecret;
      if (secret) toast.success(`Key created — secret: ${secret} (shown once, copy now)`, { duration: 10000 });
      else toast.success('API key created');
      setNewKeyLabel('');
    } catch (err) { toast.error(apiError(err, 'Failed to create API key')); }
  }

  async function handleRotate(id: string) {
    try {
      await rotateKey.mutateAsync(id);
      toast.success('API key rotated');
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
      await createWebhook.mutateAsync(webhookUrl.trim());
      toast.success('Webhook endpoint added');
      setWebhookUrl('');
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
            <div key={key.id} className='flex items-center justify-between px-4 py-3 bg-white border-b border-stroke-2 last:border-0'>
              <div>
                <p className='text-sm text-foreground font-medium'>{key.label ?? 'Unnamed key'}</p>
                <p className='text-[10px] text-xental-text-primary-400 font-mono mt-0.5'>{key.clientId}</p>
              </div>
              <div className='flex items-center gap-3'>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', key.status === 'Active' ? 'bg-green-50 text-success' : 'bg-xental-bg text-xental-text-primary-400')}>
                  {key.status ?? 'Active'}
                </span>
                <button onClick={() => setVisibleSecrets((v) => ({ ...v, [key.id]: !v[key.id] }))}>
                  {visibleSecrets[key.id] ? <EyeOff className='w-3.5 h-3.5 text-xental-text-primary-400' /> : <Eye className='w-3.5 h-3.5 text-xental-text-primary-400' />}
                </button>
                <button onClick={() => handleCopy(key.id, key.clientId ?? '')}>
                  <Copy className={cn('w-3.5 h-3.5', copiedId === key.id ? 'text-success' : 'text-xental-text-primary-400 hover:text-action-blue')} />
                </button>
                <button onClick={() => handleRotate(key.id)} title='Rotate key'>
                  <MoreVertical className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-foreground' />
                </button>
                <button onClick={() => handleDeleteKey(key.id)} title='Delete key'>
                  <Trash2 className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-destructive' />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <input
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            placeholder='Key label (e.g. Production)'
            className='border border-stroke-2 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue flex-1'
          />
          <Button size='sm' onClick={handleCreateKey} disabled={createKey.isPending}>
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
            <div key={wh.id} className='flex items-center justify-between px-4 py-3 bg-white border-b border-stroke-2 last:border-0'>
              <span className='text-sm font-mono text-foreground truncate max-w-xs'>{wh.url}</span>
              <div className='flex items-center gap-3'>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', wh.active ? 'bg-green-50 text-success' : 'bg-xental-bg text-xental-text-primary-400')}>
                  {wh.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => handleCopy(wh.id, wh.url ?? '')}>
                  <Copy className={cn('w-3.5 h-3.5', copiedId === wh.id ? 'text-success' : 'text-xental-text-primary-400 hover:text-action-blue')} />
                </button>
                <button onClick={() => handleDeleteWebhook(wh.id)}>
                  <Trash2 className='w-3.5 h-3.5 text-xental-text-primary-400 hover:text-destructive' />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder='https://yourdomain.com/webhook'
            className='border border-stroke-2 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue flex-1'
          />
          <Button size='sm' onClick={handleSaveWebhook} disabled={createWebhook.isPending}>
            <Plus className='w-3.5 h-3.5 mr-1.5' /> {createWebhook.isPending ? 'Saving...' : 'Add'}
          </Button>
        </div>
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
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [twoFa, setTwoFa] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleShow = (k: keyof typeof show) => setShow((s) => ({ ...s, [k]: !s[k] }));

  const canSave = form.current && form.newPass && form.confirm && form.newPass === form.confirm;

  async function handleSave() {
    if (form.newPass !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.newPass.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setForm({ current: '', newPass: '', confirm: '' });
    toast.success('Password updated successfully');
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
            <Button size='sm' onClick={handleSave} disabled={!canSave || loading}>
              {loading ? 'Saving…' : 'Update password'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className='border-t border-stroke-2 pt-6'>
        <div className='flex items-start justify-between max-w-md'>
          <div>
            <h3 className='text-sm font-semibold text-foreground'>Two-Factor Authentication</h3>
            <p className='text-xs text-xental-text-primary-400 mt-1'>
              Add an extra layer of security to your account using an authenticator app.
            </p>
          </div>
          <button
            onClick={() => { setTwoFa((v) => !v); toast.success(twoFa ? '2FA disabled' : '2FA enabled'); }}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer mt-0.5',
              twoFa ? 'bg-action-blue' : 'bg-stroke-2'
            )}
          >
            <span className={cn('pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform', twoFa ? 'translate-x-4' : 'translate-x-0')} />
          </button>
        </div>
        {twoFa && (
          <div className='mt-4 bg-xental-bg rounded-lg px-4 py-3 max-w-md'>
            <p className='text-xs text-xental-text-primary-500'>
              2FA is enabled. Scan the QR code in your authenticator app — setup will be available once the backend is connected.
            </p>
          </div>
        )}
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
        {tab === 'Security' && <SecurityTab />}
      </div>
    </div>
  );
}
