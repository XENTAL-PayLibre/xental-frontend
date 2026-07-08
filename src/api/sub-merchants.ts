'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, putRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { SubMerchantResponse, SubMerchantBalanceResponse } from './types/dashboard';

export function useSubMerchantsList() {
  return useQuery({
    queryKey: ['sub-merchants'],
    queryFn: () => getRequest<SubMerchantResponse[]>({ url: API_ENDPOINTS.SUB_MERCHANTS.BASE }),
    staleTime: 60 * 1000,
  });
}

export function useSubMerchantBalance(id: string | null) {
  return useQuery({
    queryKey: ['sub-merchants', id, 'balance'],
    queryFn: () => getRequest<SubMerchantBalanceResponse>({ url: API_ENDPOINTS.SUB_MERCHANTS.BALANCE(id!) }),
    enabled: !!id,
  });
}

export function useCreateSubMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; reference: string }) =>
      postRequest<SubMerchantResponse, typeof payload>({
        url: API_ENDPOINTS.SUB_MERCHANTS.BASE,
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sub-merchants'] });
      toast.success('Sub-merchant created.');
    },
    onError: (error) => {
      displayError(error, 'Unable to create sub-merchant. Please try again.', {
        409: 'A sub-merchant with this reference already exists.',
      });
    },
  });
}

export function useSetSubMerchantPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: string;
      bankName: string;
      bankCode: string;
      accountNumber: string;
      platformFeeBps: number;
    }) =>
      putRequest<SubMerchantResponse, Omit<typeof payload, 'id'>>({
        url: API_ENDPOINTS.SUB_MERCHANTS.PAYOUT(id),
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sub-merchants'] });
      toast.success('Payout account saved.');
    },
    onError: (error) => {
      displayError(error, 'Unable to save the payout account. Please try again.');
    },
  });
}
