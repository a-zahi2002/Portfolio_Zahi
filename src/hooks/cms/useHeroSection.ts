import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroService } from '../../services/heroService';
import type { HeroSection } from '../../types/cms';

export const HERO_QUERY_KEY = ['hero_section'] as const;

export const useHeroSection = () => {
  return useQuery({
    queryKey: HERO_QUERY_KEY,
    queryFn: heroService.get,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>>) =>
      heroService.update(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HERO_QUERY_KEY });
    },
  });
};
