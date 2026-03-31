/*
  Warnings:

  - A unique constraint covering the columns `[userId,clubId]` on the table `ClubJoinRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ClubJoinRequest_userId_clubId_role_key";

-- CreateIndex
CREATE UNIQUE INDEX "ClubJoinRequest_userId_clubId_key" ON "ClubJoinRequest"("userId", "clubId");
