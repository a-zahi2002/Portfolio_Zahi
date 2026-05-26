import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../../services/contactService';
import type { ContactInfo } from '../../types/cms';

export const CONTACT_QUERY_KEY = ['contact_info'] as const;

export const useContactInfo = () => {
  return useQuery({
    queryKey: CONTACT_QUERY_KEY,
    queryFn: contactService.get,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>>) =>
      contactService.update(updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACT_QUERY_KEY }),
  });
};
