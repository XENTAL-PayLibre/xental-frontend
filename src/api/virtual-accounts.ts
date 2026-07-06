'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postRequest } from '@/lib/http';
import { displayError } from './auth'; // Shared display error
import { API_ENDPOINTS } from './api-endpoints';
import type { CreateVirtualAccountPayload } from './types/virtual-accounts';
import type { VirtualAccountResponse } from './types/dashboard';

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
