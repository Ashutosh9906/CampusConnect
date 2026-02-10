/*
  Warnings:

  - You are about to drop the column `class` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordSet` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rollNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "class",
DROP COLUMN "createdAt",
DROP COLUMN "passwordHash",
DROP COLUMN "passwordSet",
DROP COLUMN "rollNo",
DROP COLUMN "type",
ADD COLUMN     "division" TEXT,
ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roll" TEXT;
