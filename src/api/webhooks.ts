'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, deleteRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';
import { displayError } from './auth';

export interface WebhookEndpoint {
  id: string;
  url: string;
  active: boolean;
  createdAtUtc: string;
}

/** Returned only at creation — carries the one-time signing secret. */
export interface WebhookEndpointCreated {
  id: string;
  url: string;
  signingSecret: string;
}

const WEBHOOKS_QUERY = ['webhook-endpoints'];

export function useWebhookEndpoints() {
  return useQuery({
    queryKey: WEBHOOKS_QUERY,
    queryFn: ({ signal }) => getRequest<WebhookEndpoint[]>({ url: API_ENDPOINTS.WEBHOOKS.BASE, signal }),
  });
}

export function useCreateWebhookEndpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['webhook-endpoints', 'create'],
    mutationFn: async (url: string) => {
      const res = await postRequest<WebhookEndpointCreated, { url: string }>({ url: API_ENDPOINTS.WEBHOOKS.BASE, payload: { url } });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WEBHOOKS_QUERY });
      toast.success('Webhook endpoint added');
    },
    onError: (error) => displayError(error, 'Could not add the webhook endpoint.', {
      400: 'Enter a valid public HTTPS URL.',
    }),
  });
}

export function useDeleteWebhookEndpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['webhook-endpoints', 'delete'],
    mutationFn: (id: string) => deleteRequest<void>({ url: API_ENDPOINTS.WEBHOOKS.ONE(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WEBHOOKS_QUERY });
      toast.success('Webhook endpoint removed');
    },
    onError: (error) => displayError(error, 'Could not remove the webhook endpoint.'),
  });
}
