-- Studio visitor content: page copy JSON + media slots.

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroPosterUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroVideoUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "aboutHeroUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "associations" JSONB;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "chips" JSONB;

ALTER TABLE "SiteSettingsTranslation" ADD COLUMN IF NOT EXISTS "pages" JSONB NOT NULL DEFAULT '{}';
