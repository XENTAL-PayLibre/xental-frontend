'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, putRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { BillingScheduleResponse, BillingPeriodResponse } from './types/dashboard';

export function useBillingSchedules() {
  return useQuery({
    queryKey: ['billing-schedules'],
    queryFn: () =>
      getRequest<BillingScheduleResponse[]>({ url: API_ENDPOINTS.BILLING.SCHEDULES }),
    staleTime: 60 * 1000,
  });
}

export function useBillingSchedule(id: string) {
  return useQuery({
    queryKey: ['billing-schedules', id],
    queryFn: () =>
      getRequest<BillingScheduleResponse>({ url: API_ENDPOINTS.BILLING.ONE(id) }),
    enabled: !!id,
  });
}

export function useBillingPeriods(id: string) {
  return useQuery({
    queryKey: ['billing-schedules', id, 'periods'],
    queryFn: () =>
      getRequest<BillingPeriodResponse[]>({ url: API_ENDPOINTS.BILLING.PERIODS(id) }),
    enabled: !!id,
  });
}

export function useCreateBillingSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      accountRef: string;
      interval: string;
      amountKobo: number;
      dueOffsetDays?: number;
      description?: string;
      reference?: string;
    }) =>
      postRequest<BillingScheduleResponse, typeof payload>({
        url: API_ENDPOINTS.BILLING.SCHEDULES,
        payload,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success('Billing schedule created.');
    },
    onError: (error) => {
      displayError(error, 'Unable to create the billing schedule. Please try again.', {
        409: 'A billing schedule already exists for this customer.',
      });
    },
  });
}

export function useSetNextAmount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amountKobo }: { id: string; amountKobo: number }) =>
      putRequest<BillingScheduleResponse, { amountKobo: number }>({
        url: API_ENDPOINTS.BILLING.NEXT_AMOUNT(id),
        payload: { amountKobo },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success('Next cycle amount updated.');
    },
    onError: (error) => {
      displayError(error, 'Unable to update the next amount. Please try again.');
    },
  });
}

function useScheduleAction(action: 'pause' | 'resume' | 'cancel', successMessage: string) {
  const qc = useQueryClient();
  const url = {
    pause: API_ENDPOINTS.BILLING.PAUSE,
    resume: API_ENDPOINTS.BILLING.RESUME,
    cancel: API_ENDPOINTS.BILLING.CANCEL,
  }[action];
  return useMutation({
    mutationFn: (id: string) =>
      postRequest<BillingScheduleResponse, Record<string, never>>({ url: url(id), payload: {} }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['billing-schedules'] });
      toast.success(successMessage);
    },
    onError: (error) => {
      displayError(error, `Unable to ${action} this schedule. Please try again.`);
    },
  });
}

export const usePauseSchedule = () => useScheduleAction('pause', 'Schedule paused.');
export const useResumeSchedule = () => useScheduleAction('resume', 'Schedule resumed.');
export const useCancelSchedule = () => useScheduleAction('cancel', 'Schedule cancelled.');
