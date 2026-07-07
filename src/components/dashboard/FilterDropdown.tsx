'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  options: (string | { label: string; value: string })[];
  value: string;
  onChange: (v: string) => void;
  hideAll?: boolean;
  disableActiveStyles?: boolean;
}

export default function FilterDropdown({ label, options, value, onChange, hideAll, disableActiveStyles }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectedOpt = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const displayLabel = selectedOpt 
    ? (typeof selectedOpt === 'string' ? selectedOpt : selectedOpt.label) 
    : (value || label);

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1 border rounded-lg px-2.5 py-1.5 text-xs transition-colors',
          value && !disableActiveStyles ? 'border-action-blue text-action-blue' : 'border-stroke-2 text-xental-text-primary-500 hover:border-action-blue'
        )}
      >
        {displayLabel} <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className='absolute right-0 top-full mt-1 bg-white border border-stroke-2 rounded-xl shadow-lg z-20 min-w-[130px] py-1'>
          {!hideAll && (
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              className='w-full flex items-center justify-between px-3 py-2 text-xs text-xental-text-primary-400 hover:bg-xental-bg'
            >
              All {label}
              {!value && <Check className='w-3 h-3 text-action-blue' />}
            </button>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
            <button
              key={optValue}
              onClick={() => { onChange(optValue); setOpen(false); }}
              className='w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-xental-bg'
            >
              {optLabel}
              {value === optValue && <Check className='w-3 h-3 text-action-blue' />}
            </button>
          )})}
        </div>
      )}
    </div>
  );
}
