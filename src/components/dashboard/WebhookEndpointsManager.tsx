'use client';

import { useState } from 'react';
import { Copy, Plus, Trash2, TriangleAlert, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useWebhookEndpoints, useCreateWebhookEndpoint, useDeleteWebhookEndpoint, type WebhookEndpointCreated } from '@/api/webhooks';

function copy(text: string, label = 'Copied') {
  navigator.clipboard.writeText(text).then(() => toast.success(label));
}

export default function WebhookEndpointsManager() {
  const { data: endpoints, isLoading } = useWebhookEndpoints();
  const create = useCreateWebhookEndpoint();
  const remove = useDeleteWebhookEndpoint();

  const [url, setUrl] = useState('');
  const [created, setCreated] = useState<WebhookEndpointCreated | null>(null);

  const submit = () => {
    const v = url.trim();
    if (!v) return toast.error('Enter a webhook URL.');
    create.mutate(v, { onSuccess: (ep) => { setUrl(''); setCreated(ep); } });
  };

  return (
    <div>
      <h3 className='mb-3 text-sm font-semibold text-foreground'>Webhooks</h3>

      {/* Existing endpoints */}
      {!isLoading && endpoints && endpoints.length > 0 && (
        <div className='mb-3 divide-y divide-stroke-2 overflow-hidden rounded-xl border border-stroke-2 bg-white'>
          {endpoints.map((ep) => (
            <div key={ep.id} className='flex items-center justify-between gap-3 px-4 py-3'>
              <div className='flex min-w-0 items-center gap-2'>
                <button onClick={() => copy(ep.url, 'URL copied')} className='truncate font-mono text-xs text-foreground hover:text-action-blue'>{ep.url}</button>
                <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase', ep.active ? 'bg-success-surface text-success-dark' : 'bg-failed-surface text-failed')}>
                  {ep.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button onClick={() => remove.mutate(ep.id)} disabled={remove.isPending} title='Remove' className='shrink-0 text-xental-text-primary-400 transition-colors hover:text-failed'>
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add endpoint */}
      <div>
        <label className='mb-1 block text-xs text-xental-text-primary-400'>Webhook URL</label>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder='https://yourdomain.com/webhooks/xental'
            className='w-full rounded-lg border border-stroke-2 px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-action-blue'
          />
          <Button size='sm' onClick={submit} disabled={create.isPending} className='shrink-0 bg-gray-900 text-white hover:bg-gray-800'>
            <Plus className='mr-1.5 h-3.5 w-3.5' /> {create.isPending ? 'Saving…' : 'Save webhook'}
          </Button>
        </div>
        <p className='mt-1.5 text-xs text-xental-text-primary-400'>Must be a public HTTPS URL. We sign every delivery — you’ll get the signing secret once, on save.</p>
      </div>

      {/* Signing secret reveal (once) */}
      <Modal open={!!created} onClose={() => setCreated(null)} title='Save your signing secret' className='max-w-lg'>
        {created && (
          <div className='space-y-4'>
            <div className='flex items-start gap-2.5 rounded-lg border border-[#f5d9a8] bg-[#fff7ed] p-3'>
              <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0 text-status-pending-1' />
              <p className='text-sm text-xental-text-primary-900'>This <strong>signing secret is shown only once</strong>. Store it now — you’ll use it to verify the HMAC-SHA256 signature on every webhook delivery.</p>
            </div>
            <div>
              <label className='mb-1 block text-xs text-xental-text-primary-400'>Endpoint URL</label>
              <code className='block truncate rounded-lg border border-stroke-2 bg-xental-bg px-3 py-2 font-mono text-sm text-foreground'>{created.url}</code>
            </div>
            <div>
              <label className='mb-1 block text-xs text-xental-text-primary-400'>Signing secret</label>
              <div className='flex items-stretch gap-2'>
                <code className='min-w-0 flex-1 truncate rounded-lg border border-stroke-2 bg-xental-bg px-3 py-2 font-mono text-sm text-foreground'>{created.signingSecret}</code>
                <button onClick={() => copy(created.signingSecret)} className='shrink-0 rounded-lg border border-stroke-2 px-3 text-xental-text-primary-500 hover:bg-xental-bg' aria-label='Copy'><Copy className='h-4 w-4' /></button>
              </div>
            </div>
            <div className='flex justify-end pt-1'><Button onClick={() => setCreated(null)}><Check className='mr-1.5 h-4 w-4' /> I’ve saved it</Button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
