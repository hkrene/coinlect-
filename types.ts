
import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface SyllabusItem {
  title: string;
  duration: string;
  content: string;
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: DBUser;
  // Legacy fields for frontend compatibility
  about?: string; // Detailed "À propos de ce cours" content
  level?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration?: string;
  modules?: number;
  category?: string;
  image?: string;
  syllabus?: SyllabusItem[];
  learningObjectives?: string[];
  // New categorization fields
  courseType?: 'academy' | 'specialization' | 'university';
  partnerName?: string;
  partnerLogo?: string;
  isPaid?: boolean;
  videoLink?: string; // YouTube/Vimeo/self-hosted video URL
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: DBUser;
  // Legacy fields for frontend compatibility
  readTime?: string;
  date?: string;
  image?: string;
  category?: string;
  authorImage?: string;
  keyTakeaways?: string;
  authorName?: string;
  featured?: boolean;
}

/**
 * Database User type (matches Prisma schema)
 */
export interface DBUser {
  id: string;
  email: string;
  passwordHash?: string;
  name?: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
  provider?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  description?: string;
  banner: string;
  bannerImage?: string;
  eventTypes: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId?: string;
  author?: DBUser;
  // Legacy field for frontend compatibility
  type?: string[]; // Keep for backward compatibility
  url?: string; // New field for external event source URL
}

/**
 * Interface for navigation links used in the Header
 */
export interface NavItem {
  label: string;
  href: string;
}

/**
 * Interface for affiliate partner organizations
 */
export interface Partner {
  name: string;
  description: string;
  logo: string;
  mobileLogo?: string; // Optional mobile-specific logo URL
}

/**
 * Interface for deals/promotions
 */
export interface Deal {
  id: string;
  title: string;
  description: string;
  details?: string;
  category: string;
  link: string;
  image?: string;
  discount?: string;
  code?: string;
  exclusive: boolean;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}