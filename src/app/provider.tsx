'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';

const MINUTE = 1000 * 60;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * MINUTE,
        staleTime: 1 * MINUTE,
        retry: false,
      },
      dehydrate: {
        // Dehydrate both resolved and still-pending queries
        // so streaming SSR / Suspense works correctly
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

export default function Provider({ children }: { children: React.ReactNode }) {
  // useState lazy initializer ensures one QueryClient per client mount
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster 
        richColors 
        position="top-right" 
        toastOptions={{
          unstyled: false, // Keeps the layout structure intact
          classNames: {
            // Custom background & text colors for different states using globals.css variables
            success: 'bg-success-surface text-success-dark border border-success/30',
            error: 'bg-failed-surface text-failed border border-failed/30',
            info: 'bg-action-blue-surface text-action-blue border border-action-blue/30',
            warning: 'bg-pending/15 text-pending-top border border-pending/30',
            // Standard fallback toast configuration
            toast: 'bg-white dark:bg-[#1a1a1a] text-black dark:text-white',
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
