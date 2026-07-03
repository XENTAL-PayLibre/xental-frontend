import type { ReactNode } from 'react';
import { type ApiOperation, DOCS_API_BASE, DOCS_SANDBOX_BASE } from '@/lib/docs/openapi';
import { codeSamples, LANGUAGES } from '@/lib/docs/code-samples';
import { highlight } from '@/lib/docs/highlight';
import { MethodBadge } from './MethodBadge';
import { PropsTable } from './PropsTable';
import { CodeTabs, type CodeBlocks } from './CodeTabs';
import { cn } from '@/lib/utils';

async function buildBlocks(op: ApiOperation): Promise<CodeBlocks> {
  const live = codeSamples(op, DOCS_API_BASE);
  const sandbox = codeSamples(op, DOCS_SANDBOX_BASE);
  const blocks: CodeBlocks = {};
  for (const l of LANGUAGES) {
    blocks[l.id] = {
      live: { raw: live[l.id], html: await highlight(live[l.id], l.id) },
      sandbox: { raw: sandbox[l.id], html: await highlight(sandbox[l.id], l.id) },
    };
  }
  return blocks;
}

const RESPONSE_TONE: Record<string, string> = {
  '2': 'bg-success-surface text-success-dark',
  '4': 'bg-failed-surface text-failed',
  '5': 'bg-failed-surface text-failed',
};

export async function Endpoint({ op, note }: { op: ApiOperation; note?: ReactNode }) {
  const pathParams = op.params.filter((p) => p.location === 'path');
  const queryParams = op.params.filter((p) => p.location === 'query');
  const blocks = await buildBlocks(op);

  return (
    <section id={op.id} className='scroll-mt-24 border-t border-border py-10 first:border-t-0'>
      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Left: reference */}
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <MethodBadge method={op.method} />
            <code className='font-mono text-sm text-xental-text-primary-900'>{op.path}</code>
          </div>
          <h3 className='mt-3 text-lg font-semibold text-foreground'>{op.summary}</h3>
          {op.description && <p className='mt-2 text-sm leading-relaxed text-xental-text-primary-500'>{op.description}</p>}
          {note && <p className='mt-2 text-sm leading-relaxed text-xental-text-primary-500'>{note}</p>}

          <div className='mt-3 flex flex-wrap gap-2'>
            <span className='inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground'>
              {op.requiresAuth ? 'Requires Bearer token' : 'Public'}
            </span>
          </div>

          <PropsTable
            title='Path parameters'
            rows={pathParams.map((p) => ({ name: p.name, type: p.type, required: p.required, description: p.description }))}
          />
          <PropsTable
            title='Query parameters'
            rows={queryParams.map((p) => ({ name: p.name, type: p.type, required: p.required, description: p.description }))}
          />
          <PropsTable
            title='Body parameters'
            rows={op.requestFields.map((f) => ({ name: f.name, type: f.type, required: f.required, description: f.description, enum: f.enum }))}
          />

          <div className='mt-6'>
            <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>Responses</h4>
            <div className='flex flex-wrap gap-2'>
              {op.responses.map((r) => (
                <span
                  key={r.status}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
                    RESPONSE_TONE[r.status[0]] ?? 'bg-muted/10 text-xental-text-primary-500',
                  )}
                >
                  <span className='font-mono font-semibold'>{r.status}</span>
                  {r.description && <span className='opacity-80'>{r.description}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: code samples (sticky) */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <CodeTabs blocks={blocks} title={`${op.method.toUpperCase()} ${op.path}`} />
          {op.requestExample && (
            <div className='mt-3 overflow-hidden rounded-xl border border-border bg-card'>
              <div className='border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-xental-text-primary-400'>
                Example request body
              </div>
              <pre className='overflow-x-auto px-4 py-3 text-[13px] leading-relaxed'>
                <code className='font-mono text-xental-text-primary-900'>{JSON.stringify(op.requestExample, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
