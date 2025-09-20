/*
  Warnings:

  - You are about to drop the column `officerId` on the `personnel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `personnel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."personnel" DROP CONSTRAINT "personnel_officerId_fkey";

-- DropIndex
DROP INDEX "public"."personnel_phoneNumber_officerId_key";

-- AlterTable
ALTER TABLE "public"."personnel" DROP COLUMN "officerId";

-- CreateIndex
CREATE UNIQUE INDEX "personnel_phoneNumber_key" ON "public"."personnel"("phoneNumber");
