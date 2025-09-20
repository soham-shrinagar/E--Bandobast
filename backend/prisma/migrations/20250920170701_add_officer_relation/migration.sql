/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber,officerId]` on the table `personnel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `officerId` to the `personnel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."personnel_phoneNumber_key";

-- AlterTable
ALTER TABLE "public"."personnel" ADD COLUMN     "officerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "personnel_phoneNumber_officerId_key" ON "public"."personnel"("phoneNumber", "officerId");

-- AddForeignKey
ALTER TABLE "public"."personnel" ADD CONSTRAINT "personnel_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "public"."Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
