'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postRequest, getRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { 
  AdminLoginRequest, 
  AdminLoginResponse, 
  ReviewActionRequest, 
  AdminOnboardingApplication, 
  AdminTenantDetailsResponse, 
  ReconciliationSummary, 
  ReconciliationTransaction, 
  FailedSettlement,
  CreateAdminRequest,
  EnrollMfaResponse,
  Admin,
} from './types/admin';
import { getCookie, setToken, COOKIE_KEYS } from '@/lib/get-token';

// Helper to grab token
const getAdminHeaders = () => {
  const token = typeof window !== 'undefined' ? getCookie(COOKIE_KEYS.admin_token) : null;
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export function useAdminLogin() {
  return useMutation({
    mutationKey: ['admin', 'login'],
    mutationFn: (payload: AdminLoginRequest) =>
      postRequest<AdminLoginResponse, AdminLoginRequest>({
        url: API_ENDPOINTS.ADMIN.LOGIN,
        payload,
      }),
    onSuccess: (data) => {
      if (data.accessToken) {
        setToken(COOKIE_KEYS.admin_token, data.accessToken, data.expiresIn);
        toast.success('Login successful');
      }
    },
    onError: (error) => displayError(error),
  });
}

export function useListAdmins() {
  return useQuery({
    queryKey: ['admin', 'list'],
    queryFn: () => getRequest<Admin[]>({
      url: API_ENDPOINTS.ADMIN.LIST_ADMINS,
      headers: getAdminHeaders(),
    }),
    staleTime: 60 * 1000,
  });
}

export function useAdminOnboardingQueue(status?: string) {
  const url = status 
    ? `${API_ENDPOINTS.ADMIN.ONBOARDING}?status=${status}` 
    : API_ENDPOINTS.ADMIN.ONBOARDING;

  return useQuery({
    queryKey: ['admin', 'onboarding-queue', status],
    queryFn: () => getRequest<AdminOnboardingApplication[]>({ 
      url, 
      headers: getAdminHeaders() 
    }),
    staleTime: 60 * 1000,
  });
}

export function useAdminTenantDetails(tenantId: string) {
  return useQuery({
    queryKey: ['admin', 'tenant-details', tenantId],
    queryFn: () => getRequest<AdminTenantDetailsResponse>({
      url: `${API_ENDPOINTS.ADMIN.ONBOARDING}/${tenantId}`,
      headers: getAdminHeaders(),
    }),
    enabled: !!tenantId,
  });
}

export function useReviewAction() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'review-action'],
    mutationFn: ({ tenantId, action, payload }: { tenantId: string, action: 'approve' | 'reject' | 'request-info', payload: ReviewActionRequest }) => {
      let url = '';
      if (action === 'approve') url = API_ENDPOINTS.ADMIN.APPROVE(tenantId);
      if (action === 'reject') url = API_ENDPOINTS.ADMIN.REJECT(tenantId);
      if (action === 'request-info') url = API_ENDPOINTS.ADMIN.REQUEST_INFO(tenantId);

      return postRequest<void, ReviewActionRequest>({
        url,
        payload,
        headers: getAdminHeaders()
      });
    },
    onSuccess: (_, { tenantId }) => {
      toast.success('Action successful');
      qc.invalidateQueries({ queryKey: ['admin', 'onboarding-queue'] });
      qc.invalidateQueries({ queryKey: ['admin', 'onboarding-detail', tenantId] });
    },
    onError: (error) => displayError(error),
  });
}

export function useReconciliationSummary() {
  return useQuery({
    queryKey: ['admin', 'reconciliation-summary'],
    queryFn: () => getRequest<ReconciliationSummary>({
      url: API_ENDPOINTS.ADMIN.RECONCILIATION_SUMMARY,
      headers: getAdminHeaders(),
    }),
    staleTime: 60 * 1000,
  });
}

export function useReconciliationBucket(bucket: string, take: number = 200) {
  return useQuery({
    queryKey: ['admin', 'reconciliation-bucket', bucket, take],
    queryFn: () => {
      const url = bucket 
        ? `${API_ENDPOINTS.ADMIN.RECONCILIATION_BUCKET}?bucket=${bucket}&take=${take}`
        : `${API_ENDPOINTS.ADMIN.RECONCILIATION_BUCKET}?take=${take}`;
      return getRequest<ReconciliationTransaction[]>({
        url,
        headers: getAdminHeaders(),
      });
    },
    staleTime: 60 * 1000,
  });
}

export function useFailedSettlements() {
  return useQuery({
    queryKey: ['admin', 'failed-settlements'],
    queryFn: () => getRequest<FailedSettlement[]>({
      url: API_ENDPOINTS.ADMIN.SETTLEMENTS_FAILED,
      headers: getAdminHeaders(),
    }),
    staleTime: 60 * 1000,
  });
}

export function useRetrySettlement() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'retry-settlement'],
    mutationFn: (virtualAccountId: string) => postRequest<void, void>({
      url: API_ENDPOINTS.ADMIN.RETRY_SETTLEMENT(virtualAccountId),
      headers: getAdminHeaders()
    }),
    onSuccess: () => {
      toast.success('Retry requested successfully');
      qc.invalidateQueries({ queryKey: ['admin', 'failed-settlements'] });
    },
    onError: displayError,
  });
}

export function useCreateAdmin() {
  return useMutation({
    mutationFn: (payload: CreateAdminRequest) => postRequest({
      url: API_ENDPOINTS.ADMIN.CREATE_ADMIN,
      payload,
      headers: getAdminHeaders(),
    }),
  });
}

export function useEnrollMfa() {
  return useMutation({
    mutationFn: () => postRequest<EnrollMfaResponse, void>({
      url: API_ENDPOINTS.ADMIN.ENROLL_MFA,
      headers: getAdminHeaders(),
    }),
  });
}
