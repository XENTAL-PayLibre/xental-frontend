'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, putRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type {
  EscrowHoldResponse,
  SettlementConfigResponse,
  SplitLegResponse,
  SplitLegInput,
} from './types/dashboard';

// ---- Split settlement (multi-beneficiary split legs) ----
export function useSplits() {
  return useQuery({
    queryKey: ['settlement-splits'],
    queryFn: () => getRequest<SplitLegResponse[]>({ url: API_ENDPOINTS.SETTLEMENT.SPLITS }),
    staleTime: 60 * 1000,
  });
}

export function useSetSplits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (splits: SplitLegInput[]) =>
      putRequest<SplitLegResponse[], { splits: SplitLegInput[] }>({
        url: API_ENDPOINTS.SETTLEMENT.SPLITS,
        payload: { splits },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settlement-splits'] });
      toast.success('Split rules saved.');
    },
    onError: (error) => {
      displayError(error, 'Unable to save split rules. Please try again.');
    },
  });
}

// ---- Settlement configuration (payout account, auto-settle, min payout) ----
export function useSettlementConfig() {
  return useQuery({
    queryKey: ['settlement-config'],
    queryFn: () =>
      getRequest<SettlementConfigResponse>({ url: API_ENDPOINTS.SETTLEMENT.CONFIG }),
    staleTime: 60 * 1000,
  });
}

export function useUpdateSettlementConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      settlementAccountNumber?: string;
      settlementBankCode?: string;
      settlementAccountName?: string;
      autoSettle: boolean;
      minPayoutKobo: number;
    }) =>
      putRequest<SettlementConfigResponse, typeof payload>({
        url: API_ENDPOINTS.SETTLEMENT.CONFIG,
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settlement-config'] });
      toast.success('Settlement settings saved.');
    },
    onError: (error) => {
      displayError(error, 'Unable to save settlement settings. Please try again.');
    },
  });
}

// ---- Per-customer escrow hold / release ----
export function useHoldSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountRef, releaseCondition }: { accountRef: string; releaseCondition?: string }) =>
      postRequest<EscrowHoldResponse, { releaseCondition?: string }>({
        url: API_ENDPOINTS.SETTLEMENT.HOLD(accountRef),
        payload: { releaseCondition },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['virtual-accounts'] });
      toast.success('Settlement held for this customer.');
    },
    onError: (error) => {
      displayError(error, 'Unable to hold settlement. Please try again.');
    },
  });
}

export function useReleaseSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountRef: string) =>
      postRequest<void, Record<string, never>>({
        url: API_ENDPOINTS.SETTLEMENT.RELEASE(accountRef),
        payload: {},
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['virtual-accounts'] });
      toast.success('Settlement released — it will settle on the next sweep.');
    },
    onError: (error) => {
      displayError(error, 'Unable to release settlement. Please try again.');
    },
  });
}
