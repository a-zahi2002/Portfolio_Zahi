import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { seoService } from '../../services/seoService';
import type { SeoPage } from '../../types/cms';

export const SEO_QUERY_KEY = (route: string) => ['seo_pages', route] as const;
export const ALL_SEO_QUERY_KEY = ['seo_pages'] as const;

export const useSeoPage = (route: string) => {
  return useQuery({
    queryKey: SEO_QUERY_KEY(route),
    queryFn: () => seoService.getByRoute(route),
    staleTime: 1000 * 60 * 10,
  });
};

export const useAllSeoPages = () => {
  return useQuery({
    queryKey: ALL_SEO_QUERY_KEY,
    queryFn: seoService.getAll,
    staleTime: 0,
  });
};

export const useUpsertSeoPage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (page: Omit<SeoPage, 'id' | 'created_at' | 'updated_at'>) =>
      seoService.upsert(page),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ALL_SEO_QUERY_KEY }),
  });
};
