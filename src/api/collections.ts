'use client';

import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';
import type {
  AgingReportResponse,
  CashFlowForecastResponse,
  CustomerScoreResponse,
} from './types/dashboard';

export function useAging() {
  return useQuery({
    queryKey: ['insights', 'aging'],
    queryFn: () => getRequest<AgingReportResponse>({ url: API_ENDPOINTS.ACCOUNT_INSIGHTS.AGING }),
    staleTime: 60 * 1000,
  });
}

export function useForecast(days = 30) {
  return useQuery({
    queryKey: ['insights', 'forecast', days],
    queryFn: () =>
      getRequest<CashFlowForecastResponse>({ url: `${API_ENDPOINTS.ACCOUNT_INSIGHTS.FORECAST}?days=${days}` }),
    staleTime: 60 * 1000,
  });
}

export function useCustomerScores() {
  return useQuery({
    queryKey: ['insights', 'customers'],
    queryFn: () => getRequest<CustomerScoreResponse[]>({ url: API_ENDPOINTS.ACCOUNT_INSIGHTS.CUSTOMERS }),
    staleTime: 60 * 1000,
  });
}
