'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl border border-stroke-2 shadow-xl w-full max-w-md p-6', className)}>
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-base font-bold text-foreground'>{title}</h2>
          <button onClick={onClose} className='text-xental-text-primary-400 hover:text-foreground'>
            <X className='w-4 h-4' />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
