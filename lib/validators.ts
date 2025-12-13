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
