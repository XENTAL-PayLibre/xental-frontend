'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { BankLookupResponse, TransferResponse, BankResponse } from './types/dashboard';

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: () => getRequest<BankResponse[]>({ url: API_ENDPOINTS.TRANSFERS.BANKS }),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useTransfers(take = 50) {
  return useQuery({
    queryKey: ['transfers', take],
    queryFn: () =>
      getRequest<TransferResponse[]>({ url: `${API_ENDPOINTS.TRANSFERS.BASE}?take=${take}` }),
    staleTime: 30 * 1000,
  });
}

/** Resolve an account name from an account number + bank code before sending a payout. */
export function useBankLookup() {
  return useMutation({
    mutationFn: (payload: { accountNumber: string; bankCode: string }) =>
      postRequest<BankLookupResponse, typeof payload>({
        url: API_ENDPOINTS.TRANSFERS.LOOKUP,
        payload,
      }),
    onError: (error) => {
      displayError(error, 'Could not resolve this account. Check the details and try again.');
    },
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      merchantTxRef: string;
      amountKobo: number;
      accountNumber: string;
      bankCode: string;
      narration?: string;
    }) =>
      postRequest<TransferResponse, typeof payload>({
        url: API_ENDPOINTS.TRANSFERS.SEND,
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transfers'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      toast.success('Payout initiated.');
    },
    onError: (error) => {
      displayError(error, 'Unable to initiate this payout. Please try again.', {
        409: 'A transfer with this reference already exists.',
      });
    },
  });
}
