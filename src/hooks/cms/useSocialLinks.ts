import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialLinksService } from '../../services/socialLinksService';
import type { SocialLinkFormData } from '../../types/cms';

export const SOCIAL_QUERY_KEY = ['social_links'] as const;
export const ALL_SOCIAL_QUERY_KEY = ['social_links', 'all'] as const;

export const useSocialLinks = () => {
  return useQuery({
    queryKey: SOCIAL_QUERY_KEY,
    queryFn: socialLinksService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllSocialLinks = () => {
  return useQuery({
    queryKey: ALL_SOCIAL_QUERY_KEY,
    queryFn: socialLinksService.getAll,
    staleTime: 0,
  });
};

export const useCreateSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (link: SocialLinkFormData) => socialLinksService.create(link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SOCIAL_QUERY_KEY });
    },
  });
};

export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SocialLinkFormData> }) =>
      socialLinksService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SOCIAL_QUERY_KEY });
    },
  });
};

export const useDeleteSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialLinksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SOCIAL_QUERY_KEY });
    },
  });
};

export const useReorderSocialLinks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order_index: number }[]) =>
      socialLinksService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIAL_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SOCIAL_QUERY_KEY });
    },
  });
};
