
import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
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
  id: number;
  title: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  modules: number;
  category: string;
  image: string;
  syllabus: SyllabusItem[];
  learningObjectives: string[];
  // New categorization fields
  courseType: 'academy' | 'specialization' | 'university';
  partnerName?: string;
  partnerLogo?: string;
  isPaid?: boolean;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  image: string;
  category: string;
  author: string;
  authorImage: string;
  featured: boolean;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: string[];
  banner: string;
  bannerText?: string;
  description?: string;
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
}