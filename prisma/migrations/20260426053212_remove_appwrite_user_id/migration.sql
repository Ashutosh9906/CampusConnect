/*
  Warnings:

  - You are about to drop the column `appwriteUserId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_appwriteUserId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "appwriteUserId";
