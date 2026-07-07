'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getRequest, postRequest, deleteRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';
import { displayError } from './auth';
import type { ApiKey, CreateApiKeyPayload } from './types/api-keys';

const KEYS_QUERY = ['api-keys'];

/** List the account's API keys (secrets not included). */
export function useApiKeys() {
  return useQuery({
    queryKey: KEYS_QUERY,
    queryFn: ({ signal }) => getRequest<ApiKey[]>({ url: API_ENDPOINTS.API_KEYS.BASE, signal }),
  });
}

/** Create a key — the returned ApiKey carries the one-time clientSecret. */
export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['api-keys', 'create'],
    mutationFn: async (payload: CreateApiKeyPayload) => {
      const res = await postRequest<ApiKey, CreateApiKeyPayload>({ url: API_ENDPOINTS.API_KEYS.BASE, payload });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS_QUERY });
      toast.success('API key created');
    },
    onError: (error) => displayError(error, 'Could not create the API key.', {
      403: 'Live keys require an approved KYC/KYB onboarding. Use a test key for now.',
    }),
  });
}

/** Rotate a key — revokes the old one and returns a fresh key with a new one-time secret. */
export function useRotateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['api-keys', 'rotate'],
    mutationFn: async (id: string) => {
      const res = await postRequest<ApiKey, Record<string, never>>({ url: API_ENDPOINTS.API_KEYS.ROTATE(id), payload: {} });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS_QUERY });
      toast.success('API key rotated');
    },
    onError: (error) => displayError(error, 'Could not rotate the API key.'),
  });
}

/** Revoke a key. */
export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['api-keys', 'revoke'],
    mutationFn: (id: string) => deleteRequest<void>({ url: API_ENDPOINTS.API_KEYS.ONE(id) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS_QUERY });
      toast.success('API key revoked');
    },
    onError: (error) => displayError(error, 'Could not revoke the API key.'),
  });
}
