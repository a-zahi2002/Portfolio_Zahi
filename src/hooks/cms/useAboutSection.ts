import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutService } from '../../services/aboutService';
import type { AboutSection } from '../../types/cms';

export const ABOUT_QUERY_KEY = ['about_section'] as const;

export const useAboutSection = () => {
  return useQuery({
    queryKey: ABOUT_QUERY_KEY,
    queryFn: aboutService.get,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateAboutSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<AboutSection, 'id' | 'created_at' | 'updated_at'>>) =>
      aboutService.update(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ABOUT_QUERY_KEY }),
  });
};
