'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { LANGUAGES } from '@/lib/docs/code-samples';
import { useLanguage } from './LanguageContext';
import { useEnvironment } from './EnvironmentContext';
import { cn } from '@/lib/utils';

export interface CodeVariant {
  html: string;
  raw: string;
}
export type CodeBlocks = Record<string, { live: CodeVariant; sandbox: CodeVariant }>;

/** Resend/Paystack-style multi-language code panel — sticky language + Live/Sandbox selection. */
export function CodeTabs({ blocks, title }: { blocks: CodeBlocks; title?: string }) {
  const { language, setLanguage } = useLanguage();
  const { env } = useEnvironment();
  const [copied, setCopied] = useState(false);

  const forLang = blocks[language] ?? blocks[LANGUAGES[0].id];
  const variant = (env === 'sandbox' ? forLang?.sandbox : forLang?.live) ?? forLang?.live;

  const copy = async () => {
    if (!variant) return;
    await navigator.clipboard.writeText(variant.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className='overflow-hidden rounded-xl border border-xental-secondary-800 bg-xental-secondary-900 text-xental-text-secondary-100 shadow-sm'>
      <div className='flex items-center justify-between border-b border-white/10 px-3'>
        <div className='flex overflow-x-auto'>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={cn(
                'shrink-0 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors',
                language === lang.id
                  ? 'border-xental-blue-400 text-white'
                  : 'border-transparent text-xental-text-secondary-500 hover:text-white',
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className='ml-2 flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-xental-text-secondary-500 transition-colors hover:bg-white/10 hover:text-white'
          aria-label='Copy code'
        >
          {copied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {title && (
        <div className='border-b border-white/5 px-4 py-2 font-mono text-[11px] text-xental-text-secondary-500'>
          {title}
        </div>
      )}
      <div
        className='overflow-x-auto px-4 py-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_code]:font-mono'
        dangerouslySetInnerHTML={{ __html: variant?.html ?? '' }}
      />
    </div>
  );
}
