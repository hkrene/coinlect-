import { z } from 'zod';

/**
 * Central validation schemas.
 *
 * Every API route that accepts user input should validate it with one of these
 * schemas before touching the database. Schemas are intentionally bounded
 * (max lengths, protocol allow-lists) to reduce payload/DoS abuse and prevent
 * stored values such as `javascript:` URLs from being rendered as links.
 */

// ---------------------------------------------------------------------------
// Reusable field primitives
// ---------------------------------------------------------------------------

/** Normalised email address with sane bounds. */
export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email is too long')
  .email('Invalid email address');

/**
 * Password policy: length-first with a light complexity requirement.
 * Applied to sign-up, password change and password reset.
 */
export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const nameField = z.string().trim().min(1, 'Name is required').max(100, 'Name is too long');

/**
 * A URL that is guaranteed to use http(s). `z.string().url()` alone accepts
 * `javascript:` / `data:` schemes which become XSS when rendered as an href.
 */
export const httpUrl = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Must be a valid http(s) URL');

/** Returns an optional schema that treats empty strings as "not provided". */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === null) return undefined;
    if (typeof value === 'string' && value.trim() === '') return undefined;
    return value;
  }, schema.optional());

export const optionalHttpUrl = optional(httpUrl);

/** Bounded optional free-text field. */
const text = (max: number) => z.string().trim().max(max).optional();

/**
 * Slug: URL-safe segment. Allows the characters historically used in content
 * slugs (letters, numbers, hyphen, underscore, dot, tilde) while blocking
 * whitespace and path/query/script characters.
 */
export const slugField = z
  .string()
  .trim()
  .min(2, 'Slug is too short')
  .max(200, 'Slug is too long')
  .regex(/^[A-Za-z0-9._~-]+$/, 'Slug contains invalid characters');

const uuidField = z.string().uuid('Invalid id');

// ---------------------------------------------------------------------------
// Auth validators
// ---------------------------------------------------------------------------

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  name: nameField,
});

export const loginSchema = z.object({
  email: emailField,
  // Do not apply the full policy on login: existing accounts may predate it.
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  userId: uuidField,
  token: z.string().trim().min(10, 'Invalid token').max(200, 'Invalid token'),
  password: passwordField,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').max(128),
  newPassword: passwordField,
});

export const updateProfileSchema = z.object({
  name: nameField.optional(),
  dateOfBirth: optional(
    z.coerce
      .date()
      .refine((date) => date.getTime() <= Date.now(), 'Date of birth cannot be in the future')
      .refine((date) => date.getFullYear() >= 1900, 'Date of birth is not valid')
  ),
  avatar: optionalHttpUrl,
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/**
 * Admin actions on a user account.
 * - promote/demote: change role
 * - activate/deactivate: suspend or restore access (used to neutralise bots)
 */
export const userActionSchema = z.object({
  userId: uuidField,
  action: z.enum(['promote', 'demote', 'activate', 'deactivate']),
});

// ---------------------------------------------------------------------------
// Course validators
// ---------------------------------------------------------------------------

export const courseSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: slugField,
  description: z.string().trim().min(10).max(5000),
  seoTitle: text(200),
  seoDescription: text(500),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  image: optionalHttpUrl,
  videoLink: optional(httpUrl),
  // Optional/legacy fields used by the frontend/admin UI
  about: text(20000),
  level: text(50),
  duration: text(50),
  category: text(100),
  courseType: z.enum(['academy', 'specialization', 'university']).optional(),
  partnerName: text(200),
  partnerLogo: optionalHttpUrl,
  isPaid: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Module validators
// ---------------------------------------------------------------------------

export const moduleSchema = z.object({
  title: z.string().trim().min(2).max(200),
  content: z.string().trim().min(1).max(50000),
  order: z.number().int().nonnegative().max(100000),
  durationMin: z.number().int().positive().max(100000).optional(),
});

// ---------------------------------------------------------------------------
// Article validators
// ---------------------------------------------------------------------------

export const articleSchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug: slugField,
  excerpt: text(1000),
  content: z.string().trim().min(10).max(200000),
  tags: z.array(z.string().trim().max(50)).max(30).default([]),
  seoTitle: text(200),
  seoDescription: text(500),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().default(false).optional(),
  image: optionalHttpUrl,
  authorImage: optionalHttpUrl,
  keyTakeaways: text(5000),
  authorName: text(200),
});

// ---------------------------------------------------------------------------
// Event validators
// ---------------------------------------------------------------------------

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug: slugField,
  date: z.string().trim().min(2).max(100),
  location: z.string().trim().min(2).max(300),
  description: text(5000),
  banner: z.string().trim().min(1).max(2000),
  bannerImage: optionalHttpUrl,
  eventTypes: z.array(z.string().trim().max(50)).max(30).default([]),
  seoTitle: text(200),
  seoDescription: text(500),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  url: optional(httpUrl),
});

// ---------------------------------------------------------------------------
// Featured validators
// ---------------------------------------------------------------------------

export const featuredSchema = z.object({
  type: z.enum(['COURSE', 'ARTICLE']),
  refId: uuidField,
  order: z.number().int().nonnegative().max(100000).default(0),
  spotlight: z.boolean().default(false),
});

export const featuredBulkUpdateSchema = z.object({
  items: z
    .array(
      z.object({
        id: uuidField,
        order: z.number().int().nonnegative().max(100000).optional(),
        spotlight: z.boolean().optional(),
      })
    )
    .max(200),
});

// ---------------------------------------------------------------------------
// Enrollment validators
// ---------------------------------------------------------------------------

export const enrollmentSchema = z.object({
  courseId: uuidField,
});

// ---------------------------------------------------------------------------
// Progress validators
// ---------------------------------------------------------------------------

export const progressSchema = z.object({
  courseId: uuidField,
  moduleId: uuidField,
  completed: z.boolean().default(true),
  progressPct: z.number().int().min(0).max(100).optional(),
});

// ---------------------------------------------------------------------------
// Deal validators
// ---------------------------------------------------------------------------

export const dealSchema = z.object({
  title: z.string().trim().min(2).max(300),
  description: z.string().trim().min(10).max(5000),
  details: text(10000),
  category: z.string().trim().min(2).max(100),
  link: httpUrl,
  image: optionalHttpUrl,
  discount: text(100),
  code: text(100),
  exclusive: z.boolean().default(false).optional(),
  verified: z.boolean().default(false).optional(),
  featured: z.boolean().default(false).optional(),
});

// ---------------------------------------------------------------------------
// Donation validators
// ---------------------------------------------------------------------------

const MAX_SATS = 1_000_000_000; // 10 BTC equivalent, well above any realistic donation

export const lightningDonationSchema = z.object({
  amountSats: z.coerce.number().int().positive().max(MAX_SATS, 'Amount is too large'),
  memo: z.string().trim().max(200).optional(),
  metadata: z.record(z.any()).optional(),
});

export const donationStatusUpdateSchema = z.object({
  donationId: uuidField,
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
  amountSats: z.number().int().positive().max(MAX_SATS).optional(),
  reference: text(500),
});

// ---------------------------------------------------------------------------
// Chat validators
// ---------------------------------------------------------------------------

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(2000, 'Message is too long'),
  language: z.string().trim().max(10).optional(),
});
