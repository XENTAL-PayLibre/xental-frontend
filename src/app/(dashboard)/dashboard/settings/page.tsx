'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ApiKeysManager from '@/components/dashboard/ApiKeysManager';
import WebhookEndpointsManager from '@/components/dashboard/WebhookEndpointsManager';
import TeamManager from '@/components/dashboard/TeamManager';

type Tab = 'Profile' | 'Team' | 'Developers' | 'Security';
const TABS: Tab[] = ['Profile', 'Team', 'Developers', 'Security'];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className='flex items-center gap-1 border border-stroke-2 rounded-lg p-1 w-fit mb-6'>
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            'px-3 py-1 text-xs rounded-md transition-colors',
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

function ProfileTab() {
  const [form, setForm] = useState({
    businessName: 'PayLibre',
    registrationNumber: '40987235984AB',
    businessType: 'Educational Institution',
    industry: 'Education',
    country: 'Nigeria',
    businessAddress: 'Peeters, Off west avenue, Lagos',
    countryCode: '+234',
    phoneNumber: '703 567 8999',
    email: 'johndoe.ltd@gmail.com',
    website: 'johndoe.ltd@meridian.com',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => toast.success('Profile updated successfully');

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        <InputField label='Business name' value={form.businessName} onChange={set('businessName')} />
        <InputField label='Business registration number' value={form.registrationNumber} onChange={set('registrationNumber')} />
        <InputField label='Business type' value={form.businessType} onChange={set('businessType')} />
        <InputField label='Industry' value={form.industry} onChange={set('industry')} />
        <InputField label='Country' value={form.country} onChange={set('country')} />
        <InputField label='Business address' value={form.businessAddress} onChange={set('businessAddress')} />
        <div className='col-span-2 grid grid-cols-3 gap-4'>
          <InputField label='Country code' value={form.countryCode} disabled />
          <InputField label='Phone Number' value={form.phoneNumber} onChange={set('phoneNumber')} />
          <InputField label='Email' value={form.email} onChange={set('email')} />
        </div>
        <div className='col-span-2'>
          <InputField label='Website' value={form.website} onChange={set('website')} />
        </div>
      </div>
      <div className='mt-6 flex justify-end'>
        <Button size='sm' onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}

function TeamTab() {
  return <TeamManager />;
}

function DevelopersTab() {
  return (
    <div className='flex flex-col gap-6'>
      <ApiKeysManager />
      <div className='border-t border-stroke-2 pt-6'>
        <WebhookEndpointsManager />
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

  function PasswordField({ label, field }: { label: string; field: keyof typeof form }) {
    return (
      <div>
        <label className='block text-xs text-xental-text-primary-400 mb-1'>{label}</label>
        <div className='relative'>
          <input
            type={show[field] ? 'text' : 'password'}
            value={form[field]}
            onChange={(e) => set(field)(e.target.value)}
            placeholder='••••••••'
            className='w-full border border-stroke-2 rounded-lg px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-action-blue/30 focus:border-action-blue'
          />
          <button type='button' onClick={() => toggleShow(field)} className='absolute right-3 top-1/2 -translate-y-1/2 text-xental-text-primary-400 hover:text-foreground'>
            {show[field] ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Change Password */}
      <div>
        <h3 className='text-sm font-semibold text-foreground mb-1'>Change Password</h3>
        <p className='text-xs text-xental-text-primary-400 mb-4'>Update your password to keep your account secure.</p>
        <div className='flex flex-col gap-4 max-w-md'>
          <PasswordField label='Current password' field='current' />
          <PasswordField label='New password' field='newPass' />
          <PasswordField label='Confirm new password' field='confirm' />
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

      <div className='bg-white rounded-xl border border-stroke-2 p-6'>
        <TabBar active={tab} onChange={setTab} />
        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Team' && <TeamTab />}
        {tab === 'Developers' && <DevelopersTab />}
        {tab === 'Security' && <SecurityTab />}
      </div>
    </div>
  );
}
