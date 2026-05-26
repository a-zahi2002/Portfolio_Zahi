import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack React Query client configuration.
 * - staleTime: 5 minutes (content rarely changes mid-session)
 * - retry: 2 attempts before showing error
 * - refetchOnWindowFocus: false (avoids unnecessary refetches)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
