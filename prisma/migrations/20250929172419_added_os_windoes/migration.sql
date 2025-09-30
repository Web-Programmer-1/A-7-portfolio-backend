/*
  Warnings:

  - Made the column `userAgent` on table `VisitorLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device` on table `VisitorLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."VisitorLog" ADD COLUMN     "browser" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "os" TEXT NOT NULL DEFAULT 'Unknown',
ALTER COLUMN "userAgent" SET NOT NULL,
ALTER COLUMN "device" SET NOT NULL;
