import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsService } from '../../services/skillsService';
import type { SkillFormData } from '../../types/cms';

export const SKILLS_QUERY_KEY = ['skills'] as const;
export const ALL_SKILLS_QUERY_KEY = ['skills', 'all'] as const;

export const useSkills = () => {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: skillsService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllSkills = () => {
  return useQuery({
    queryKey: ALL_SKILLS_QUERY_KEY,
    queryFn: skillsService.getAll,
    staleTime: 0,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skill: SkillFormData) => skillsService.create(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SKILLS_QUERY_KEY });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SkillFormData> }) =>
      skillsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SKILLS_QUERY_KEY });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SKILLS_QUERY_KEY });
    },
  });
};

export const useReorderSkills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; display_order: number }[]) =>
      skillsService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_SKILLS_QUERY_KEY });
    },
  });
};
