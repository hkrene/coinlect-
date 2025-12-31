import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Deal } from '@/types';

// Query keys
export const dealKeys = {
  all: ['deals'] as const,
  lists: () => [...dealKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...dealKeys.lists(), filters] as const,
  details: () => [...dealKeys.all, 'detail'] as const,
  detail: (id: string) => [...dealKeys.details(), id] as const,
};

// Fetch all deals
export function useDeals(filters?: { published?: boolean; featured?: boolean }) {
  return useQuery({
    queryKey: dealKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.published !== undefined) {
        params.set('published', filters.published.toString());
      }
      if (filters?.featured !== undefined) {
        params.set('featured', filters.featured.toString());
      }

      const response = await fetch(`/api/deals?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }
      const data = await response.json();
      return data.deals as Deal[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Create deal mutation
export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create deal');
      }

      const data = await response.json();
      return data.deal as Deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });
}

// Update deal mutation
export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Deal> }) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update deal');
      }

      const data = await response.json();
      return data.deal as Deal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dealKeys.detail(data.id) });
    },
  });
}

// Delete deal mutation
export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete deal');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dealKeys.lists() });
    },
  });
}
