'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTeam, useInviteTeamMember, useUpdateTeamMember, useRemoveTeamMember, type TeamMember, type TeamRole } from '@/api/team';

const ROLES: TeamRole[] = ['Admin', 'Employee', 'Developer'];
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-CA'); // YYYY-MM-DD

type FormState = { id: string | null; name: string; email: string; role: TeamRole };

export default function TeamManager() {
  const { data: members, isLoading, isError } = useTeam();
  const invite = useInviteTeamMember();
  const update = useUpdateTeamMember();
  const remove = useRemoveTeamMember();

  const [form, setForm] = useState<FormState | null>(null); // null = list view

  const startAdd = () => setForm({ id: null, name: '', email: '', role: 'Developer' });
  const startEdit = (m: TeamMember) => setForm({ id: m.id, name: m.name, email: m.email, role: m.role });

  const save = () => {
    if (!form) return;
    if (form.name.trim().length < 1) return toast.error('Enter a full name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return toast.error('Enter a valid email.');
    const input = { name: form.name.trim(), email: form.email.trim(), role: form.role };
    if (form.id) update.mutate({ id: form.id, input }, { onSuccess: () => setForm(null) });
    else invite.mutate(input, { onSuccess: () => setForm(null) });
  };

  const del = () => {
    if (form?.id) remove.mutate(form.id, { onSuccess: () => setForm(null) });
  };

  // ── Add / Edit form ────────────────────────────────────────────────
  if (form) {
    const busy = invite.isPending || update.isPending || remove.isPending;
    return (
      <div>
        <button onClick={() => setForm(null)} className='mb-4 inline-flex items-center gap-1.5 text-xs text-xental-text-primary-400 hover:text-foreground'>
          <ArrowLeft className='h-3.5 w-3.5' /> Back to team
        </button>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>Basic information</h3>
          <div className='flex gap-2'>
            {form.id && <Button size='sm' variant='outline' className='text-failed hover:text-failed' onClick={del} disabled={busy}>Delete</Button>}
            <Button size='sm' onClick={save} disabled={busy}>{busy ? 'Saving…' : form.id ? 'Save changes' : 'Send invite'}</Button>
          </div>
        </div>

        <div className='mt-5 grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-xs text-xental-text-primary-400'>Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue' />
          </div>
          <div>
            <label className='mb-1 block text-xs text-xental-text-primary-400'>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type='email' className='w-full rounded-lg border border-stroke-2 px-3 py-2 text-sm outline-none focus:border-action-blue' />
          </div>
        </div>
        <div className='mt-4 max-w-xs'>
          <label className='mb-1 block text-xs text-xental-text-primary-400'>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as TeamRole })} className='w-full rounded-lg border border-stroke-2 bg-white px-3 py-2 text-sm outline-none focus:border-action-blue'>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {!form.id && <p className='mt-4 text-xs text-xental-text-primary-400'>We’ll email an invitation. They set a password to accept, then sign in with their role.</p>}
      </div>
    );
  }

  // ── List ───────────────────────────────────────────────────────────
  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-foreground'>Team members</h3>
        <Button size='sm' onClick={startAdd}><Plus className='mr-1.5 h-3.5 w-3.5' /> Add team member</Button>
      </div>

      <div className='overflow-hidden rounded-xl border border-stroke-2 bg-white'>
        {isLoading ? (
          <div className='p-6 text-center text-sm text-xental-text-primary-400'>Loading team…</div>
        ) : isError ? (
          <div className='p-6 text-center text-sm text-failed'>Couldn’t load your team.</div>
        ) : !members || members.length === 0 ? (
          <div className='p-8 text-center'>
            <p className='text-sm font-medium text-foreground'>No team members yet</p>
            <p className='mt-1 text-xs text-xental-text-primary-500'>Invite someone to collaborate on this account.</p>
          </div>
        ) : (
          <>
            <table className='hidden w-full text-sm md:table'>
              <thead>
                <tr className='border-b border-stroke-2 text-left text-xs text-xental-text-primary-400'>
                  <th className='px-5 py-3 font-medium'>Name</th>
                  <th className='px-5 py-3 font-medium'>Role</th>
                  <th className='px-5 py-3 font-medium'>Date Added</th>
                  <th className='px-5 py-3' />
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className='border-b border-stroke-2 last:border-0'>
                    <td className='px-5 py-3'>
                      <p className='font-medium text-foreground'>{m.name}</p>
                      <p className='text-xs text-xental-text-primary-400'>{m.email}</p>
                    </td>
                    <td className='px-5 py-3'>
                      <span className='text-xental-text-primary-500'>{m.role}</span>
                      {m.status === 'Invited' && <span className='ml-2 rounded bg-[#fff7ed] px-1.5 py-0.5 text-[10px] font-medium text-status-pending-1'>Pending</span>}
                    </td>
                    <td className='px-5 py-3 text-xental-text-primary-500'>{fmtDate(m.createdAtUtc)}</td>
                    <td className='px-5 py-3'>
                      <div className='flex justify-end gap-1'>
                        <button onClick={() => startEdit(m)} title='Edit' className='rounded-md p-1.5 text-xental-text-primary-400 hover:bg-xental-bg hover:text-action-blue'><Pencil className='h-3.5 w-3.5' /></button>
                        <button onClick={() => remove.mutate(m.id)} title='Remove' className='rounded-md p-1.5 text-xental-text-primary-400 hover:bg-failed-surface hover:text-failed'><Trash2 className='h-3.5 w-3.5' /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className='divide-y divide-stroke-2 md:hidden'>
              {members.map((m) => (
                <div key={m.id} className='flex items-start justify-between gap-3 p-4'>
                  <div className='min-w-0'>
                    <p className='truncate font-medium text-foreground'>{m.name}</p>
                    <p className='truncate text-xs text-xental-text-primary-400'>{m.email}</p>
                    <p className='mt-1 text-xs text-xental-text-primary-500'>{m.role}{m.status === 'Invited' && ' · Pending'} · {fmtDate(m.createdAtUtc)}</p>
                  </div>
                  <div className='flex shrink-0 gap-1'>
                    <button onClick={() => startEdit(m)} className='rounded-md p-1.5 text-xental-text-primary-400 hover:bg-xental-bg'><Pencil className='h-3.5 w-3.5' /></button>
                    <button onClick={() => remove.mutate(m.id)} className='rounded-md p-1.5 text-xental-text-primary-400 hover:bg-failed-surface hover:text-failed'><Trash2 className='h-3.5 w-3.5' /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
