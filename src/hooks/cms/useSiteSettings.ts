import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../../services/settingsService';
import type { SiteSettings } from '../../types/cms';

export const SETTINGS_QUERY_KEY = ['site_settings'] as const;

export const useSiteSettings = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: settingsService.get,
    staleTime: 1000 * 60 * 10, // Settings rarely change — 10 min cache
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>) =>
      settingsService.update(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY }),
  });
};
