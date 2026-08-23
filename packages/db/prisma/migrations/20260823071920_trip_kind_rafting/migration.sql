-- CreateEnum
CREATE TYPE "TripKind" AS ENUM ('trek', 'rafting');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "addonTrekId" TEXT,
ADD COLUMN     "privateDeparture" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Trek" ADD COLUMN     "altitudeProfile" JSONB,
ADD COLUMN     "bestMonths" INTEGER[],
ADD COLUMN     "exclusions" TEXT[],
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "inclusions" TEXT[],
ADD COLUMN     "kind" "TripKind" NOT NULL DEFAULT 'trek',
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "river" TEXT,
ALTER COLUMN "maxAltitudeM" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "faqId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FaqTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialTranslation" (
    "id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "attribution" TEXT NOT NULL,

    CONSTRAINT "TestimonialTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FaqTranslation_faqId_locale_key" ON "FaqTranslation"("faqId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialTranslation_testimonialId_locale_key" ON "TestimonialTranslation"("testimonialId", "locale");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_addonTrekId_fkey" FOREIGN KEY ("addonTrekId") REFERENCES "Trek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqTranslation" ADD CONSTRAINT "FaqTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "Faq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialTranslation" ADD CONSTRAINT "TestimonialTranslation_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
