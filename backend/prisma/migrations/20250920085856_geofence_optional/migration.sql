/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."geofencing" ALTER COLUMN "center_lat" DROP NOT NULL,
ALTER COLUMN "center_long" DROP NOT NULL,
ALTER COLUMN "polygon" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otp_phoneNumber_key" ON "public"."otp"("phoneNumber");
