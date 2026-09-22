-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "googlePlaceId" TEXT NOT NULL DEFAULT '';
