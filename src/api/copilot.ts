'use client';

import { useMutation } from '@tanstack/react-query';
import { postRequest } from '@/lib/http';
import { API_ENDPOINTS } from './api-endpoints';
import type { CopilotAnswer } from './types/dashboard';

export function useAskCopilot() {
  return useMutation({
    mutationFn: (prompt: string) =>
      postRequest<CopilotAnswer, { prompt: string }>({
        url: API_ENDPOINTS.COPILOT.ASK,
        payload: { prompt },
      }),
  });
}
