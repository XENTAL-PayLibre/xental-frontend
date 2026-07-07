'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useCreateAdmin } from '@/api/admin';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateAdminModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  const { mutate: createAdmin, isPending } = useCreateAdmin();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin(
      { email, password, role },
      {
        onSuccess: () => {
          toast.success('Admin created successfully');
          onClose();
          setEmail('');
          setPassword('');
          setRole('Admin');
        },
      }
    );
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
      <div 
        className='bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-6 border-b border-stroke-2'>
          <div>
            <h2 className='text-lg font-bold text-foreground'>Create New Admin</h2>
            <p className='text-xs text-xental-text-primary-400 mt-1'>Invite a new member to the Xental Ops team.</p>
          </div>
          <button 
            onClick={onClose}
            className='p-2 text-xental-text-primary-400 hover:text-foreground hover:bg-xental-bg rounded-lg transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-5'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-bold uppercase tracking-wider text-xental-text-primary-500'>Email Address</label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='e.g. name@xental.com'
              className='w-full px-3 py-2 text-sm border border-stroke-2 rounded-lg focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue placeholder:text-xental-text-primary-300'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-bold uppercase tracking-wider text-xental-text-primary-500'>Initial Password</label>
            <input
              type='password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full px-3 py-2 text-sm border border-stroke-2 rounded-lg focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue placeholder:text-xental-text-primary-300'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-[10px] font-bold uppercase tracking-wider text-xental-text-primary-500'>Admin Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='w-full px-3 py-2 text-sm border border-stroke-2 rounded-lg focus:outline-none focus:border-action-blue focus:ring-1 focus:ring-action-blue bg-white'
            >
              <option value='Admin'>Admin</option>
              <option value='SuperAdmin'>SuperAdmin</option>
            </select>
          </div>

          <div className='flex items-center justify-end gap-3 pt-4 border-t border-stroke-2 mt-2'>
            <Button type='button' variant='outline' onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending} className='min-w-[120px]'>
              {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Create Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
