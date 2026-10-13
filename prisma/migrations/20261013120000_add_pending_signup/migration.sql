-- Local signup flow change: unconfirmed signups are staged in PendingSignup and
-- the User row is only created after the visitor confirms their email by clicking
-- the emailed link. No data migration needed — legacy rows are unaffected.

-- CreateTable
CREATE TABLE "PendingSignup" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PendingSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingSignup_email_key" ON "PendingSignup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingSignup_tokenHash_key" ON "PendingSignup"("tokenHash");

-- CreateIndex
CREATE INDEX "PendingSignup_email_expiresAt_idx" ON "PendingSignup"("email", "expiresAt");