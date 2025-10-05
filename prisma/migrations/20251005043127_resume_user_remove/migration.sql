-- DropForeignKey
ALTER TABLE "public"."Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Resume" ALTER COLUMN "education" DROP NOT NULL;
