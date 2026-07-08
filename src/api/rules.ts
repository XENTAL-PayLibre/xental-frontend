'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, deleteRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { RuleResponse } from './types/dashboard';

export function useRules() {
  return useQuery({
    queryKey: ['rules'],
    queryFn: () => getRequest<RuleResponse[]>({ url: API_ENDPOINTS.RULES.BASE }),
    staleTime: 60 * 1000,
  });
}

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      trigger: string;
      action: string;
      thresholdKobo?: number;
      minRiskScore?: number;
      priority: number;
    }) =>
      postRequest<RuleResponse, typeof payload>({
        url: API_ENDPOINTS.RULES.BASE,
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rules'] });
      toast.success('Rule added.');
    },
    onError: (error) => {
      displayError(error, 'Unable to add this rule. Please try again.');
    },
  });
}

export function useDeleteRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest<void>({ url: API_ENDPOINTS.RULES.ONE(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rules'] });
      toast.success('Rule removed.');
    },
    onError: (error) => {
      displayError(error, 'Unable to remove this rule. Please try again.');
    },
  });
}
