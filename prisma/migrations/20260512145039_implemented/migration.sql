-- CreateTable
CREATE TABLE "DeletedEvent" (
    "id" TEXT NOT NULL,
    "originalEventId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "hostName" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhones" TEXT[],
    "registrationLink" TEXT,
    "brochureUrl" TEXT,
    "deletedByUserId" TEXT NOT NULL,
    "deletedByRole" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeletedEvent" ADD CONSTRAINT "DeletedEvent_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedEvent" ADD CONSTRAINT "DeletedEvent_deletedByUserId_fkey" FOREIGN KEY ("deletedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
