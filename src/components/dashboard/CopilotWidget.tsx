'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAskCopilot } from '@/api/copilot';
import type { CopilotAction } from '@/api/types/dashboard';

type Msg = {
  role: 'user' | 'assistant';
  text: string;
  suggestions?: string[];
  actions?: CopilotAction[];
};

const GREETING: Msg = {
  role: 'assistant',
  text: "Hi 👋 I'm your collections copilot. Ask me about your account — I answer from your live data.",
  suggestions: [
    "What's my collection rate?",
    'How much is outstanding?',
    'What can I expect over the next 30 days?',
    'Which customers are at risk?',
  ],
};

export default function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const ask = useAskCopilot();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = (prompt: string) => {
    const text = prompt.trim();
    if (!text || ask.isPending) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    ask.mutate(text, {
      onSuccess: (a) =>
        setMessages((m) => [...m, { role: 'assistant', text: a.reply, suggestions: a.suggestions, actions: a.actions }]),
      onError: () =>
        setMessages((m) => [...m, { role: 'assistant', text: "Sorry — I couldn't reach your data just now. Please try again." }]),
    });
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label='Open copilot'
        className='fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-action-blue text-white shadow-lg transition-transform hover:scale-105'
      >
        {open ? <X className='h-5 w-5' /> : <Sparkles className='h-5 w-5' />}
      </button>

      {/* Panel */}
      {open && (
        <div className='fixed bottom-20 right-5 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-stroke-2 bg-white shadow-2xl'>
          <div className='flex items-center gap-2 border-b border-stroke-2 px-4 py-3'>
            <span className='flex h-7 w-7 items-center justify-center rounded-full bg-action-blue-surface'>
              <Sparkles className='h-4 w-4 text-action-blue' />
            </span>
            <div>
              <p className='text-sm font-semibold text-foreground leading-none'>Copilot</p>
              <p className='text-[10px] text-xental-text-primary-400 mt-0.5'>Grounded in your live data</p>
            </div>
          </div>

          <div ref={scrollRef} className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
            {messages.map((m, i) => (
              <div key={i} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3 py-2 text-xs whitespace-pre-line',
                    m.role === 'user' ? 'bg-action-blue text-white' : 'bg-xental-bg text-foreground'
                  )}
                >
                  {m.text}
                </div>
                {m.actions && m.actions.length > 0 && (
                  <div className='mt-1.5 flex flex-wrap gap-1.5'>
                    {m.actions.map((a, j) => (
                      <Link key={j} href={a.href} onClick={() => setOpen(false)}
                        className='inline-flex items-center gap-1 rounded-md bg-action-blue-surface px-2 py-1 text-[11px] font-medium text-action-blue hover:opacity-80'>
                        {a.label} <ArrowUpRight className='h-3 w-3' />
                      </Link>
                    ))}
                  </div>
                )}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className='mt-1.5 flex flex-wrap gap-1.5'>
                    {m.suggestions.map((s, j) => (
                      <button key={j} type='button' onClick={() => send(s)}
                        className='rounded-full border border-stroke-2 px-2.5 py-1 text-[11px] text-xental-text-primary-500 hover:bg-xental-bg'>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {ask.isPending && (
              <div className='flex items-start'>
                <div className='rounded-2xl bg-xental-bg px-3 py-2 text-xs text-xental-text-primary-400'>Thinking…</div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className='flex items-center gap-2 border-t border-stroke-2 px-3 py-2.5'
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ask about your account…'
              className='flex-1 rounded-lg border border-stroke-2 px-3 py-2 text-xs outline-none focus:border-action-blue bg-transparent text-foreground'
            />
            <button type='submit' disabled={ask.isPending || !input.trim()}
              className='flex h-8 w-8 items-center justify-center rounded-lg bg-action-blue text-white disabled:opacity-40'>
              <Send className='h-4 w-4' />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
