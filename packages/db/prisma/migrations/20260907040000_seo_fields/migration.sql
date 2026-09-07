-- CreateEnum
CREATE TYPE "TrekRegion" AS ENUM ('annapurna', 'everest', 'langtang', 'restricted', 'hidden_gems', 'other');

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "siteUrl" TEXT NOT NULL DEFAULT 'https://upperpathtreks.com';
ALTER TABLE "SiteSettings" ADD COLUMN "ogImageUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN "googleSiteVerification" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "geoLat" DOUBLE PRECISION NOT NULL DEFAULT 28.2096;
ALTER TABLE "SiteSettings" ADD COLUMN "geoLng" DOUBLE PRECISION NOT NULL DEFAULT 83.962;
ALTER TABLE "SiteSettings" ADD COLUMN "facebookUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "instagramUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "tripadvisorUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN "googleBusinessUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Trek" ADD COLUMN "region" "TrekRegion" NOT NULL DEFAULT 'other';

-- AlterTable
ALTER TABLE "TrekTranslation" ADD COLUMN "seoTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TrekTranslation" ADD COLUMN "seoDescription" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TrekTranslation" ADD COLUMN "imageAlt" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BlogPostTranslation" ADD COLUMN "seoTitle" TEXT NOT NULL DEFAULT '';
ALTER TABLE "BlogPostTranslation" ADD COLUMN "seoDescription" TEXT NOT NULL DEFAULT '';
