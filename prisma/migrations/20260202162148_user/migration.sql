/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[appwriteUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appwriteUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "appwriteUserId" TEXT NOT NULL,
ADD COLUMN     "class" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordSet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prn" TEXT,
ADD COLUMN     "rollNo" TEXT,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "User_appwriteUserId_key" ON "User"("appwriteUserId");
