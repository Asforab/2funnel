-- AlterTable
ALTER TABLE "Permissions" ADD COLUMN     "canCreateAgency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canCreateSubAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteAgency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteSubAccount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canUpdateAgency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canUpdateSubAccount" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "access" SET DEFAULT false;
