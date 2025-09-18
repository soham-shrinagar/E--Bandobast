-- CreateTable
CREATE TABLE "public"."Officer" (
    "id" SERIAL NOT NULL,
    "officerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personnel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "stationName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "checkOutTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Officer_officerId_key" ON "public"."Officer"("officerId");

-- CreateIndex
CREATE UNIQUE INDEX "Officer_email_key" ON "public"."Officer"("email");
