
import { User, Course, Article, Event, Deal } from '../types';


export const courseService = {
  getAll: async (): Promise<Course[]> => {
    try {
      const response = await fetch('/api/courses', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      return data.courses || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },
  add: async (course: Omit<Course, 'id' | 'slug'> & { slug: string }): Promise<Course> => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(course),
      });
      if (!response.ok) throw new Error('Failed to create course');
      const data = await response.json();
      return data.course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete course');
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    try {
      const response = await fetch('/api/articles', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  },
  getFeatured: async (): Promise<Article[]> => {
    const articles = await articleService.getAll();
    return articles.filter(a => a.featured);
  },
  add: async (article: Omit<Article, 'id' | 'slug'> & { slug: string }): Promise<Article> => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(article),
      });
      if (!response.ok) throw new Error('Failed to create article');
      const data = await response.json();
      return data.article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },
  update: async (id: string, updates: Partial<Article>): Promise<Article | null> => {
    try {
      const response = await fetch(`/api/articles/by-id/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Article update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update article');
      }
      const data = await response.json();
      return data.article;
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/articles/by-id/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Article delete failed:', errorData);
        throw new Error(errorData.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }
};

export const dealService = {
  getAll: async (): Promise<Deal[]> => {
    try {
      const response = await fetch('/api/deals', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      return data.deals || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
  },
  add: async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> => {
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(deal),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add deal');
      }
      const data = await response.json();
      return data.deal;
    } catch (error) {
      console.error('Error adding deal:', error);
      throw error;
    }
  },
};

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await fetch('/api/events', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },
  add: async (event: Omit<Event, 'id' | 'slug'> & { slug: string }): Promise<Event> => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to create event');
      const data = await response.json();
      return data.event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};
