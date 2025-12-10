
import { User, Course, Article } from '../types';
import { COURSES_DATA, ARTICLES_DATA, DEALS_DATA, Deal } from '../mockData';

const STORAGE_KEYS = {
  USERS: 'coinlect_users',
  COURSES: 'coinlect_courses',
  ARTICLES: 'coinlect_articles',
  DEALS: 'coinlect_deals',
  SESSION: 'coinlect_session',
  SUBSCRIBERS: 'coinlect_subscribers'
};

const initData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(COURSES_DATA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(ARTICLES_DATA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)) {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify([]));
  }
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(DEALS_DATA));
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@coinlect.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  }
};

initData();

export const userService = {
  getAll: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  create: (user: Omit<User, 'id' | 'createdAt'>): User => {
    const users = userService.getAll();
    if (users.find(u => u.email === user.email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },
  toggleRole: (id: string) => {
    const users = userService.getAll();
    const user = users.find(u => u.id === id);
    if (user) {
      user.role = user.role === 'admin' ? 'user' : 'admin';
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  },
  login: (email: string): User | null => {
    const users = userService.getAll();
    return users.find(u => u.email === email) || null;
  },
  delete: (id: string) => {
    let users = userService.getAll();
    users = users.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

export const courseService = {
  getAll: (): Course[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
  },
  add: (course: Omit<Course, 'id'>) => {
    const courses = courseService.getAll();
    const newCourse = { ...course, id: Date.now() };
    courses.push(newCourse as Course);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    return newCourse;
  },
  delete: (id: number) => {
    let courses = courseService.getAll();
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }
};

export const articleService = {
  getAll: (): Article[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
  },
  getFeatured: (): Article[] => {
    const articles = articleService.getAll();
    return articles.filter(a => a.featured);
  },
  add: (article: Omit<Article, 'id'>) => {
    const articles = articleService.getAll();
    const newArticle = { ...article, id: Date.now() };
    articles.unshift(newArticle as Article);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    return newArticle;
  },
  delete: (id: number) => {
    let articles = articleService.getAll();
    articles = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }
};

export const dealService = {
  getAll: (): Deal[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALS) || '[]');
  }
};

export const newsletterService = {
  getAll: (): { email: string; subscribedAt: string }[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS) || '[]');
  },
  add: (email: string) => {
    const subs = newsletterService.getAll();
    if (!subs.find(s => s.email === email)) {
      subs.push({ email, subscribedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subs));
    }
  },
  delete: (email: string) => {
    let subs = newsletterService.getAll();
    subs = subs.filter(s => s.email !== email);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subs));
  }
};
