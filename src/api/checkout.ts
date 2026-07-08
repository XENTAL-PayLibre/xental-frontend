'use client';

import { useMutation } from '@tanstack/react-query';
import { postRequest } from '@/lib/http';
import { displayError } from './auth';
import { API_ENDPOINTS } from './api-endpoints';
import type { CheckoutSessionResponse } from './types/dashboard';

/** Create a hosted checkout / payment-link session for a customer's virtual account. */
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (payload: { accountRef: string; ttlSeconds?: number }) =>
      postRequest<CheckoutSessionResponse, typeof payload>({
        url: API_ENDPOINTS.CHECKOUT.SESSIONS,
        payload,
      }),
    onError: (error) => {
      displayError(error, 'Unable to create a payment link. Please try again.');
    },
  });
}
