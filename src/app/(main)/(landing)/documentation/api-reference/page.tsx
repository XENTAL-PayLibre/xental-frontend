import type { Metadata } from 'next';
import Link from 'next/link';
import { API_TAGS } from '@/lib/docs/nav';
import { getOperationsByTag } from '@/lib/docs/openapi';
import { Prose } from '@/components/docs/Prose';

export const metadata: Metadata = {
  title: 'API Reference — Xental',
  description: 'Complete reference for the Xental developer API.',
};

export default function ApiReferenceIndex() {
  const groups = [...new Set(API_TAGS.map((t) => t.group))];
  return (
    <div>
      <Prose>
        <h1>API Reference</h1>
        <p>
          Every developer-facing endpoint, grouped by resource. Each page shows request parameters, responses, and
          copy-paste examples in eight languages.
        </p>
      </Prose>

      <div className='mt-8 space-y-8'>
        {groups.map((group) => (
          <div key={group}>
            <h2 className='mb-3 text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>{group}</h2>
            <div className='grid gap-3 sm:grid-cols-2'>
              {API_TAGS.filter((t) => t.group === group).map((t) => {
                const count = getOperationsByTag(t.tag).length;
                return (
                  <Link
                    key={t.slug}
                    href={`/documentation/api-reference/${t.slug}`}
                    className='group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40'
                  >
                    <div className='flex items-center justify-between'>
                      <h3 className='font-semibold text-foreground group-hover:text-primary'>{t.title}</h3>
                      <span className='text-xs text-xental-text-primary-400'>
                        {count} endpoint{count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className='mt-1 text-sm leading-6 text-xental-text-primary-500'>{t.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
