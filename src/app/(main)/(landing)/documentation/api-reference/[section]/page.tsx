import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_TAGS, tagBySlug } from '@/lib/docs/nav';
import { getOperationsByTag } from '@/lib/docs/openapi';
import { getSectionContent } from '@/lib/docs/content';
import { Endpoint } from '@/components/docs/Endpoint';
import { Prose } from '@/components/docs/Prose';
import { Callout } from '@/components/docs/Callout';

export function generateStaticParams() {
  return API_TAGS.map((t) => ({ section: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const meta = tagBySlug(section);
  return {
    title: meta ? `${meta.title} — Xental API` : 'API Reference — Xental',
    description: meta?.summary,
  };
}

export default async function ApiSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const meta = tagBySlug(section);
  if (!meta) notFound();

  const ops = getOperationsByTag(meta.tag);
  const content = getSectionContent(section);

  return (
    <div>
      <Prose>
        <h1>{meta.title}</h1>
        <p>{meta.summary}</p>
        {content.intro && <p>{content.intro}</p>}
      </Prose>

      {/* Quirks & troubleshooting up top so integrators see them before diving in. */}
      {content.quirks && content.quirks.length > 0 && (
        <div className='mt-6'>
          {content.quirks.map((q, i) => (
            <Callout key={i} variant={q.variant} title={q.title}>
              {q.body}
            </Callout>
          ))}
        </div>
      )}

      <div className='mt-2'>
        {ops.length === 0 ? (
          <p className='mt-8 text-sm text-xental-text-primary-500'>No endpoints in this section.</p>
        ) : (
          ops.map((op) => (
            <Endpoint key={op.id} op={op} note={content.notes?.[`${op.method.toUpperCase()} ${op.path}`]} />
          ))
        )}
      </div>
    </div>
  );
}
