import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { educationService } from '../../services/educationService';
import type { EducationFormData } from '../../types/cms';

export const EDUCATION_QUERY_KEY = ['education'] as const;
export const ALL_EDUCATION_QUERY_KEY = ['education', 'all'] as const;

export const useEducation = () => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEY,
    queryFn: educationService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllEducation = () => {
  return useQuery({
    queryKey: ALL_EDUCATION_QUERY_KEY,
    queryFn: educationService.getAll,
    staleTime: 0,
  });
};

export const useEducationItem = (id: string) => {
  return useQuery({
    queryKey: ['education', id],
    queryFn: () => educationService.getById(id),
    enabled: !!id,
  });
};

export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (education: EducationFormData) => educationService.create(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EDUCATION_QUERY_KEY });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<EducationFormData> }) =>
      educationService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EDUCATION_QUERY_KEY });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => educationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EDUCATION_QUERY_KEY });
    },
  });
};

export const useToggleEducationVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      educationService.toggleVisibility(id, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EDUCATION_QUERY_KEY });
    },
  });
};

export const useReorderEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order_index: number }[]) =>
      educationService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_EDUCATION_QUERY_KEY });
    },
  });
};
