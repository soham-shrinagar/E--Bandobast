/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Officer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Officer" ADD COLUMN     "password" TEXT,
ALTER COLUMN "officerId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Officer_phoneNumber_key" ON "public"."Officer"("phoneNumber");
