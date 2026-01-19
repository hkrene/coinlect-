import { z } from 'zod';

// Auth validators
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Course validators
export const courseSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  image: z.string().optional(),
  videoLink: z.string().optional(),
  // Optional/legacy fields used by the frontend/admin UI
  about: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  category: z.string().optional(),
  courseType: z.enum(['academy', 'specialization', 'university']).optional(),
  partnerName: z.string().optional(),
  partnerLogo: z.string().optional(),
  isPaid: z.boolean().optional(),
});

// Module validators
export const moduleSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
  order: z.number().int().nonnegative(),
  durationMin: z.number().int().positive().optional(),
});

// Article validators
export const articleSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().default(false).optional(),
  image: z.string().optional(),
  authorImage: z.string().optional(),
  keyTakeaways: z.string().optional(),
  authorName: z.string().optional(),
});

// Event validators
export const eventSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    date: z.string().min(2),
    location: z.string().min(2),
    description: z.string().optional(),
    banner: z.string().min(1),
    bannerImage: z.string().url().optional(),
    eventTypes: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    url: z.string().url().optional(),
});

// Featured validators
export const featuredSchema = z.object({
  type: z.enum(['COURSE', 'ARTICLE']),
  refId: z.string().uuid(),
  order: z.number().int().nonnegative().default(0),
  spotlight: z.boolean().default(false),
});

// Enrollment validators
export const enrollmentSchema = z.object({
  courseId: z.string().uuid(),
});

// Progress validators
export const progressSchema = z.object({
  courseId: z.string().uuid(),
  moduleId: z.string().uuid(),
  completed: z.boolean().default(true),
  progressPct: z.number().int().min(0).max(100).optional(),
});

// Deal validators
export const dealSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  details: z.string().optional(),
  category: z.string().min(2),
  link: z.string().url(),
  image: z.string().url().optional(),
  discount: z.string().optional(),
  code: z.string().optional(),
  exclusive: z.boolean().default(false).optional(),
  verified: z.boolean().default(false).optional(),
  featured: z.boolean().default(false).optional(),
});
