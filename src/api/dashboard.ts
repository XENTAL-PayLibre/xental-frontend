'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequest, postRequest, deleteRequest } from '@/lib/http';
import type {
  InsightsResponse,
  SubMerchantResponse,
  TransactionResponse,
  VirtualAccountResponse,
  ApiKeyResponse,
  DeveloperProfileResponse,
  WebhookEndpointResponse,
  WebhookEndpointCreatedResponse,
  SimulatedDepositResponse,
} from './types/dashboard';
import { API_ENDPOINTS } from './api-endpoints';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      getRequest<DeveloperProfileResponse>({ url: '/developers/me' }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () =>
      getRequest<InsightsResponse>({
        url: API_ENDPOINTS.ACCOUNT_INSIGHTS.BASE,
      }),
    staleTime: 60 * 1000,
  });
}

export function useSubMerchants() {
  return useQuery({
    queryKey: ['sub-merchants'],
    queryFn: () => getRequest<SubMerchantResponse[]>({ url: '/sub-merchants' }),
    staleTime: 60 * 1000,
  });
}

export function useTransactions(params?: { status?: string; limit?: number; virtualAccountId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.virtualAccountId) searchParams.set('virtualAccountId', params.virtualAccountId);
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () =>
      getRequest<TransactionResponse[]>({
        url: `/transactions${qs ? `?${qs}` : ''}`,
      }),
    staleTime: 30 * 1000,
  });
}

export function useTransaction(reference: string) {
  return useQuery({
    queryKey: ['transactions', reference],
    queryFn: () =>
      getRequest<TransactionResponse>({ url: `/transactions/${reference}` }),
    enabled: !!reference,
  });
}



export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: () => getRequest<ApiKeyResponse[]>({ url: '/api-keys' }),
    staleTime: 60 * 1000,
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { label: string; mode: string }) =>
      postRequest<ApiKeyResponse, typeof payload>({
        url: '/api-keys',
        payload,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
}

export function useRotateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      postRequest<ApiKeyResponse, Record<string, never>>({
        url: `/api-keys/${id}/rotate`,
        payload: {},
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest<void>({ url: `/api-keys/${id}` }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
}

export function useWebhookEndpoints() {
  return useQuery({
    queryKey: ['webhook-endpoints'],
    queryFn: () =>
      getRequest<WebhookEndpointResponse[]>({ url: '/webhook-endpoints' }),
    staleTime: 60 * 1000,
  });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) =>
      postRequest<WebhookEndpointCreatedResponse, { url: string }>({
        url: '/webhook-endpoints',
        payload: { url },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['webhook-endpoints'] }),
  });
}

export function useDeleteWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteRequest<void>({ url: `/webhook-endpoints/${id}` }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['webhook-endpoints'] }),
  });
}

export function useSimulateDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      accountRef: string;
      amountKobo: number;
      senderName: string;
    }) =>
      postRequest<SimulatedDepositResponse, typeof payload>({
        url: '/sandbox/simulate/deposit',
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
    },
  });
}
