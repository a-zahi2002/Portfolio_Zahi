import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesService } from '../../services/certificatesService';
import type { CertificateFormData } from '../../types/cms';

export const CERTS_QUERY_KEY = ['certificates'] as const;
export const ALL_CERTS_QUERY_KEY = ['certificates', 'all'] as const;

export const useCertificates = () => {
  return useQuery({
    queryKey: CERTS_QUERY_KEY,
    queryFn: certificatesService.getVisible,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllCertificates = () => {
  return useQuery({
    queryKey: ALL_CERTS_QUERY_KEY,
    queryFn: certificatesService.getAll,
    staleTime: 0,
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ['certificates', id],
    queryFn: () => certificatesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cert: CertificateFormData) => certificatesService.create(cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_CERTS_QUERY_KEY });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CertificateFormData> }) =>
      certificatesService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_CERTS_QUERY_KEY });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificatesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_CERTS_QUERY_KEY });
    },
  });
};

export const useToggleCertVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visible }: { id: string; visible: boolean }) =>
      certificatesService.toggleVisibility(id, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_CERTS_QUERY_KEY });
    },
  });
};

export const useReorderCertificates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order_index: number }[]) =>
      certificatesService.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CERTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_CERTS_QUERY_KEY });
    },
  });
};
