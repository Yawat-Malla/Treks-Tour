-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'zh', 'ko', 'he');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('new', 'contacted', 'confirmed', 'cancelled');

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteTitle" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "whatsapp" TEXT NOT NULL,
    "viber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wechatId" TEXT NOT NULL,
    "wechatQrUrl" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "trekkerCount" INTEGER NOT NULL DEFAULT 2400,
    "yearsGuiding" INTEGER NOT NULL DEFAULT 12,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "settingsId" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "heroHeadline" TEXT NOT NULL,
    "heroSubhead" TEXT NOT NULL,
    "introTitle" TEXT NOT NULL,
    "introBody" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutBody" TEXT NOT NULL,

    CONSTRAINT "SiteSettingsTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trek" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "maxAltitudeM" INTEGER NOT NULL,
    "priceFromUsd" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "heroImageUrl" TEXT NOT NULL,
    "gallery" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrekTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "trekId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itinerary" JSONB NOT NULL,
    "seasonLabel" TEXT NOT NULL,
    "difficultyLabel" TEXT NOT NULL,

    CONSTRAINT "TrekTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "trekId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "message" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'new',
    "staffNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettingsTranslation_settingsId_locale_key" ON "SiteSettingsTranslation"("settingsId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Trek_slug_key" ON "Trek"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrekTranslation_trekId_locale_key" ON "TrekTranslation"("trekId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_reference_key" ON "Booking"("reference");

-- AddForeignKey
ALTER TABLE "SiteSettingsTranslation" ADD CONSTRAINT "SiteSettingsTranslation_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrekTranslation" ADD CONSTRAINT "TrekTranslation_trekId_fkey" FOREIGN KEY ("trekId") REFERENCES "Trek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trekId_fkey" FOREIGN KEY ("trekId") REFERENCES "Trek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
