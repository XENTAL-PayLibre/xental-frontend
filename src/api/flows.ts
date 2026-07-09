'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { FlowResponse, FlowRunResponse } from './types/dashboard';

export type FlowPayload = {
  name: string;
  trigger: string;
  actions: string[];
  minAmountKobo?: number;
  minRiskScore?: number;
  priority: number;
};

export function useFlows() {
  return useQuery({
    queryKey: ['flows'],
    queryFn: () => getRequest<FlowResponse[]>({ url: API_ENDPOINTS.FLOWS.BASE }),
    staleTime: 30 * 1000,
  });
}

export function useFlowRuns() {
  return useQuery({
    queryKey: ['flow-runs'],
    queryFn: () => getRequest<FlowRunResponse[]>({ url: API_ENDPOINTS.FLOWS.RUNS }),
    staleTime: 15 * 1000,
  });
}

export function useCreateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FlowPayload) =>
      postRequest<FlowResponse, FlowPayload>({ url: API_ENDPOINTS.FLOWS.BASE, payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Flow created.');
    },
    onError: (error) => displayError(error, 'Unable to create this flow. Please try again.'),
  });
}

export function useUpdateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: FlowPayload & { id: string }) =>
      putRequest<FlowResponse, FlowPayload>({ url: API_ENDPOINTS.FLOWS.ONE(id), payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Flow updated.');
    },
    onError: (error) => displayError(error, 'Unable to update this flow. Please try again.'),
  });
}

export function useSetFlowEnabled() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      postRequest<void, { enabled: boolean }>({ url: API_ENDPOINTS.FLOWS.ENABLED(id), payload: { enabled } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['flows'] }),
    onError: (error) => displayError(error, 'Unable to change this flow. Please try again.'),
  });
}

export function useDeleteFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRequest<void>({ url: API_ENDPOINTS.FLOWS.ONE(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Flow removed.');
    },
    onError: (error) => displayError(error, 'Unable to remove this flow. Please try again.'),
  });
}
