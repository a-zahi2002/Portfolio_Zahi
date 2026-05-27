import { QueryClient, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

/**
 * TanStack React Query client configuration.
 * - staleTime: 5 minutes (content rarely changes mid-session)
 * - retry: 2 attempts before showing error
 * - refetchOnWindowFocus: false (avoids unnecessary refetches)
 */
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error: Error | unknown) => {
      toast.error(`Operation failed: ${(error as Error)?.message || 'Unknown error'}`);
    },
  }),
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
