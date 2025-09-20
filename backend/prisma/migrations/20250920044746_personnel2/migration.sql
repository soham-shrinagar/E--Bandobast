-- CreateTable
CREATE TABLE "public"."personnelMobile" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "personnelMobile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personnelMobile_phoneNumber_key" ON "public"."personnelMobile"("phoneNumber");
