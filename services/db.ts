
import { User, Course, Article, Event } from '../types';
import { COURSES_DATA, ARTICLES_DATA, DEALS_DATA, Deal } from '../mockData';

const STORAGE_KEYS = {
  USERS: 'coinlect_users',
  COURSES: 'coinlect_courses',
  ARTICLES: 'coinlect_articles',
  DEALS: 'coinlect_deals',
  EVENTS: 'coinlect_events',
  SESSION: 'coinlect_session'
};

const initData = () => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(COURSES_DATA));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(ARTICLES_DATA));
  }
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(DEALS_DATA));
  
  // Initialize events with default data if not exists
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const defaultEvents: Event[] = [
      {
        id: 1,
        title: 'Africa Blockchain Festival 2025',
        date: 'Friday, November 7, 2025',
        location: 'Kigali Convention Center, Rwanda',
        type: ['CONFERENCE'],
        banner: 'africa-blockchain-festival',
        bannerText: 'SAVE THE DATE\n7th - 9th November 2025\nKigali Convention Center, Rwanda'
      },
      {
        id: 2,
        title: 'Blockf3st Africa 2025',
        date: 'Saturday, October 11, 2025',
        location: 'Please register to see the exact location of this event.',
        type: ['MEETUP', 'CONFERENCE', 'WEB3'],
        banner: 'blockf3st-africa',
        bannerText: 'BLOCKF3ST AFRICA'
      },
      {
        id: 3,
        title: 'Aptos Meet & Build, Edo',
        date: 'Saturday, September 20, 2025',
        location: 'Opolo Hub, Uniben Benin City, Edo State',
        type: ['WORKSHOP'],
        banner: 'aptos-meet-build',
        bannerText: 'APTOS\nMeet Build\nOpolo Hub, UniBen Benin City, Edo State'
      },
      {
        id: 4,
        title: 'Aptos Africa BOOTCAMP',
        date: 'Monday, August 25, 2025',
        location: 'Virtual',
        type: ['HACKATHON', 'WORKSHOP'],
        banner: 'aptos-bootcamp',
        bannerText: 'MOVE BOOTCAMP\nHackathon Pool: $100,000 USD'
      },
      {
        id: 5,
        title: 'Developer Meetup with Mantle',
        date: 'Saturday, July 5, 2025',
        location: 'Cafe One Yaba',
        type: ['MEETUP', 'WORKSHOP'],
        banner: 'mantle-meetup',
        bannerText: 'Developer Meetup with Mantle\n10:00 AM - 3:00 PM\n5th July, 2025\nCafe One, Yaba, Lagos'
      },
      {
        id: 6,
        title: '#StellarWACon25- Where Blockchain Meets the Real World',
        date: 'Saturday, May 31, 2025',
        location: 'The zone, Gbagada expressway, Lagos.',
        type: ['CONFERENCE'],
        banner: 'stellar-wacon',
        bannerText: 'Stellar West Africa Conference 2025\nWhere Blockchain Meets the Real World\nMay 31st, 2025.\nLagos, Nigeria'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(defaultEvents));
  }
  
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
  } else {
    // Ensure admin user exists even if users array exists
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const adminExists = users.find((u: User) => u.email === 'admin@coinlect.com');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@coinlect.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      users.push(adminUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }
};

// Only initialize on client-side
if (typeof window !== 'undefined') {
  initData();
}

export const userService = {
  getAll: (): User[] => {
    if (typeof window === 'undefined') return [];
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
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
  },
  add: (course: Omit<Course, 'id'>) => {
    const courses = courseService.getAll();
    const newCourse = { ...course, id: Date.now() };
    courses.unshift(newCourse as Course); // Add to beginning so new courses appear at top
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
    if (typeof window === 'undefined') return [];
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
  update: (id: number, updates: Partial<Article>) => {
    const articles = articleService.getAll();
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
      return articles[index];
    }
    return null;
  },
  delete: (id: number) => {
    let articles = articleService.getAll();
    articles = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }
};

export const dealService = {
  getAll: (): Deal[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALS) || '[]');
  }
};

export const eventService = {
  getAll: (): Event[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  },
  add: (event: Omit<Event, 'id'>) => {
    const events = eventService.getAll();
    const newEvent = { ...event, id: Date.now() };
    events.unshift(newEvent as Event);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  },
  delete: (id: number) => {
    let events = eventService.getAll();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }
};
