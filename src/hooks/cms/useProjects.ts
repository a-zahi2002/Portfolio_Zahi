import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../../services/projectsService';
import type { CMSProject, ProjectFormData } from '../../types/cms';

export const PROJECTS_QUERY_KEY = ['projects'] as const;
export const ALL_PROJECTS_QUERY_KEY = ['projects', 'all'] as const;

/** Public hook — visible projects only */
export const useProjects = () => {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: projectsService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

/** Admin hook — all projects including hidden */
export const useAllProjects = () => {
  return useQuery({
    queryKey: ALL_PROJECTS_QUERY_KEY,
    queryFn: projectsService.getAll,
    staleTime: 0,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: ProjectFormData) => projectsService.create(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_PROJECTS_QUERY_KEY });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ProjectFormData> }) =>
      projectsService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_PROJECTS_QUERY_KEY });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_PROJECTS_QUERY_KEY });
    },
  });
};

export const useToggleProjectVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      projectsService.toggleVisibility(id, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_PROJECTS_QUERY_KEY });
    },
  });
};

export const useReorderProjects = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order_index: number }[]) =>
      projectsService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_PROJECTS_QUERY_KEY });
    },
  });
};
