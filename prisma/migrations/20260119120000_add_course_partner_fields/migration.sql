-- Add optional/legacy course fields used by the frontend/admin UI
ALTER TABLE "Course"
  ADD COLUMN IF NOT EXISTS "about" TEXT,
  ADD COLUMN IF NOT EXISTS "level" TEXT,
  ADD COLUMN IF NOT EXISTS "duration" TEXT,
  ADD COLUMN IF NOT EXISTS "category" TEXT,
  ADD COLUMN IF NOT EXISTS "courseType" TEXT,
  ADD COLUMN IF NOT EXISTS "partnerName" TEXT,
  ADD COLUMN IF NOT EXISTS "partnerLogo" TEXT,
  ADD COLUMN IF NOT EXISTS "isPaid" BOOLEAN NOT NULL DEFAULT false;

