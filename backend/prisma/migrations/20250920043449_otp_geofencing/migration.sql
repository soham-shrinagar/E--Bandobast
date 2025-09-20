-- CreateTable
CREATE TABLE "public"."geofencing" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "center_lat" DOUBLE PRECISION NOT NULL,
    "center_long" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION,
    "polygon" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geofencing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);
