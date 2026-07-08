'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, deleteRequest } from '@/lib/http';
import { displayError } from './auth';
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
  TransactionSummaryResponse,
  RefundResponse,
  WebhookDeliveryResponse,
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

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      postRequest<void, typeof payload>({
        url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        payload,
      }),
    onSuccess: () => toast.success('Password updated.'),
    onError: (error) => {
      displayError(error, 'Unable to change your password. Please try again.', {
        400: 'Your current password is incorrect, or the new password is too weak.',
      });
    },
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

export function useTransactions(params?: {
  status?: string;
  reconciliation?: string;
  accountRef?: string;
  take?: number;
  from?: string;
  to?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.reconciliation) searchParams.set('reconciliation', params.reconciliation);
  if (params?.accountRef) searchParams.set('accountRef', params.accountRef);
  if (params?.take) searchParams.set('take', String(params.take));
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  const qs = searchParams.toString();

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () =>
      getRequest<TransactionResponse[]>({
        url: `${API_ENDPOINTS.TRANSACTIONS.BASE}${qs ? `?${qs}` : ''}`,
      }),
    staleTime: 30 * 1000,
  });
}

export function useTransaction(reference: string) {
  return useQuery({
    queryKey: ['transactions', reference],
    queryFn: () =>
      getRequest<TransactionResponse>({ url: API_ENDPOINTS.TRANSACTIONS.ONE(reference) }),
    enabled: !!reference,
  });
}

export function useRefundTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      reference,
      destination,
    }: {
      reference: string;
      destination?: { accountNumber?: string; bankCode?: string; accountName?: string };
    }) =>
      postRequest<RefundResponse, typeof destination>({
        url: API_ENDPOINTS.TRANSACTIONS.REFUND(reference),
        payload: destination ?? {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['virtual-accounts'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      toast.success('Refund sent to the payer.');
    },
    onError: (error) => {
      displayError(error, 'Unable to process the refund. Please try again.', {
        400: 'No refundable surplus for this transaction.',
        409: 'A refund for this deposit is already in progress.',
      });
    },
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

export function useWebhookDeliveries(status?: string) {
  const qs = status ? `?status=${status}` : '';
  return useQuery({
    queryKey: ['webhook-deliveries', status],
    queryFn: () =>
      getRequest<WebhookDeliveryResponse[]>({
        url: `${API_ENDPOINTS.WEBHOOKS.DELIVERIES}${qs}`,
      }),
    staleTime: 30 * 1000,
  });
}

export function useReplayDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      postRequest<void, Record<string, never>>({
        url: API_ENDPOINTS.WEBHOOKS.REPLAY(id),
        payload: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhook-deliveries'] });
      toast.success('Delivery queued for replay.');
    },
    onError: (error) => {
      displayError(error, 'Unable to replay this delivery. Please try again.');
    },
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

export function useTransactionsSummary() {
  return useQuery({
    queryKey: ['transactions', 'summary'],
    queryFn: () =>
      getRequest<TransactionSummaryResponse>({ url: '/transactions/summary' }),
    staleTime: 60 * 1000,
  });
}
