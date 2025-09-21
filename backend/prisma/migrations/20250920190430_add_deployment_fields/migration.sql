-- AlterTable
ALTER TABLE "public"."personnelMobile" ADD COLUMN     "currentCords" JSONB,
ADD COLUMN     "deployed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "geofenceName" TEXT,
ADD COLUMN     "onShift" BOOLEAN NOT NULL DEFAULT false;
