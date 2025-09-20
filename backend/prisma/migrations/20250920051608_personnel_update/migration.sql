/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `personnel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "personnel_phoneNumber_key" ON "public"."personnel"("phoneNumber");
