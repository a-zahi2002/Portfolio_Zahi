import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experiencesService } from '../../services/experiencesService';
import type { ExperienceFormData } from '../../types/cms';

export const EXPERIENCES_QUERY_KEY = ['experiences'] as const;
export const ALL_EXPERIENCES_QUERY_KEY = ['experiences', 'all'] as const;

export const useExperiences = () => {
  return useQuery({
    queryKey: EXPERIENCES_QUERY_KEY,
    queryFn: experiencesService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllExperiences = () => {
  return useQuery({
    queryKey: ALL_EXPERIENCES_QUERY_KEY,
    queryFn: experiencesService.getAll,
    staleTime: 0,
  });
};

export const useExperience = (id: string) => {
  return useQuery({
    queryKey: ['experiences', id],
    queryFn: () => experiencesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (experience: ExperienceFormData) => experiencesService.create(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EXPERIENCES_QUERY_KEY });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ExperienceFormData> }) =>
      experiencesService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EXPERIENCES_QUERY_KEY });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experiencesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EXPERIENCES_QUERY_KEY });
    },
  });
};

export const useToggleExperienceVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      experiencesService.toggleVisibility(id, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EXPERIENCES_QUERY_KEY });
    },
  });
};

export const useReorderExperiences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order_index: number }[]) =>
      experiencesService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EXPERIENCES_QUERY_KEY });
    },
  });
};
