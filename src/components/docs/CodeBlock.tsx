'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className='my-4 overflow-hidden rounded-xl border border-xental-secondary-800 bg-xental-secondary-900'>
      <div className='flex items-center justify-between border-b border-white/10 px-4 py-2'>
        <span className='font-mono text-[11px] uppercase tracking-wide text-xental-text-secondary-500'>
          {language ?? 'code'}
        </span>
        <button
          onClick={copy}
          className='flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-xental-text-secondary-500 transition-colors hover:bg-white/10 hover:text-white'
          aria-label='Copy code'
        >
          {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className='overflow-x-auto px-4 py-4 text-[13px] leading-relaxed text-xental-text-secondary-100'>
        <code className='font-mono'>{code}</code>
      </pre>
    </div>
  );
}
