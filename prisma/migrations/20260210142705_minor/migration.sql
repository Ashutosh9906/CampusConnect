-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordSet" BOOLEAN NOT NULL DEFAULT false;
