import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Article } from '@/types';

// Query keys
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (id: string) => [...articleKeys.details(), id] as const,
};

// Fetch all articles
export function useArticles(filters?: { published?: boolean; featured?: boolean }) {
  return useQuery({
    queryKey: articleKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.published !== undefined) {
        params.set('published', filters.published.toString());
      }
      if (filters?.featured !== undefined) {
        params.set('featured', filters.featured.toString());
      }

      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      return data.articles as Article[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single article
export function useArticle(id: string) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/articles/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await response.json();
      return data.article as Article;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Create article mutation
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleData: Omit<Article, 'id' | 'slug'> & { slug: string }) => {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create article');
      }

      const data = await response.json();
      return data.article as Article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}

// Update article mutation
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Article> }) => {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update article');
      }

      const data = await response.json();
      return data.article as Article;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(data.id) });
    },
  });
}

// Delete article mutation
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete article');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}

// Toggle featured status
export function useToggleArticleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update article');
      }

      const data = await response.json();
      return data.article as Article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
    },
  });
}
