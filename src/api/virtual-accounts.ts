'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postRequest, getRequest, deleteRequest } from '@/lib/http';
import { displayError } from './auth'; // Shared display error
import { API_ENDPOINTS } from './api-endpoints';
import type { CreateVirtualAccountPayload } from './types/virtual-accounts';
import type { VirtualAccountResponse } from './types/dashboard';

export function useVirtualAccountsList(subMerchantRef?: string) {
  return useQuery({
    queryKey: ['virtual-accounts', { subMerchantRef: subMerchantRef ?? null }],
    queryFn: () =>
      getRequest<VirtualAccountResponse[]>({
        url: `${API_ENDPOINTS.VIRTUAL_ACCOUNTS.LIST}${subMerchantRef ? `?subMerchantRef=${encodeURIComponent(subMerchantRef)}` : ''}`,
      }),
    staleTime: 60 * 1000,
  });
}

export function useVirtualAccount(accountRef: string) {
  return useQuery({
    queryKey: ['virtual-accounts', accountRef],
    queryFn: () =>
      getRequest<VirtualAccountResponse>({
        url: `/virtual-accounts/${accountRef}`,
      }),
    enabled: !!accountRef,
  });
}

export function useCreateVirtualAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['virtual-accounts', 'create'],
    mutationFn: (payload: CreateVirtualAccountPayload) =>
      postRequest<VirtualAccountResponse, CreateVirtualAccountPayload>({
        url: API_ENDPOINTS.VIRTUAL_ACCOUNTS.CREATE,
        payload,
      }),
    onSuccess: (response) => {
      // Invalidate relevant queries
      qc.invalidateQueries({ queryKey: ['virtual-accounts'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      
      toast.success('Virtual account provisioned successfully!');
    },
    onError: (error) => {
      displayError(error, 'Unable to provision virtual account. Please try again.', {
        409: 'A virtual account already exists for this account reference.',
      });
    },
  });
}

export function useDeleteVirtualAccount() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['virtual-accounts', 'delete'],
    mutationFn: (accountRef: string) =>
      deleteRequest<void>({ url: `/virtual-accounts/${accountRef}` }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['virtual-accounts'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      toast.success('Customer deleted.');
    },
    onError: (error) => {
      displayError(error, 'Unable to delete this customer. Please try again.', {
        409: 'This customer has payment activity and cannot be deleted.',
      });
    },
  });
}
