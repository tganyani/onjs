/*
  Warnings:

  - You are about to drop the `CandidateLetter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateLetter" DROP CONSTRAINT "CandidateLetter_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateLetter" DROP CONSTRAINT "CandidateLetter_jobId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "field" TEXT,
ADD COLUMN     "letter" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "field" TEXT;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" JSONB;

-- AlterTable
ALTER TABLE "_AcceptedCandidateToJob" ADD CONSTRAINT "_AcceptedCandidateToJob_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AcceptedCandidateToJob_AB_unique";

-- AlterTable
ALTER TABLE "_AcceptedCandidateToRecruiter" ADD CONSTRAINT "_AcceptedCandidateToRecruiter_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_AcceptedCandidateToRecruiter_AB_unique";

-- AlterTable
ALTER TABLE "_CandidateToJob" ADD CONSTRAINT "_CandidateToJob_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CandidateToJob_AB_unique";

-- AlterTable
ALTER TABLE "_JobToLikedJobs" ADD CONSTRAINT "_JobToLikedJobs_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_JobToLikedJobs_AB_unique";

-- AlterTable
ALTER TABLE "_JobToRefusedCandidate" ADD CONSTRAINT "_JobToRefusedCandidate_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_JobToRefusedCandidate_AB_unique";

-- AlterTable
ALTER TABLE "_RecruiterToRefusedCandidate" ADD CONSTRAINT "_RecruiterToRefusedCandidate_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_RecruiterToRefusedCandidate_AB_unique";

-- DropTable
DROP TABLE "CandidateLetter";

-- CreateTable
CREATE TABLE "ProposedCandidate" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposedCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewedCandidate" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewedCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telegram" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Telegram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "invitation" BOOLEAN NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "proposal" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterNotification" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruiterNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobToProposedCandidate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobToProposedCandidate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobToViewedCandidate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobToViewedCandidate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProposedCandidateToRecruiter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProposedCandidateToRecruiter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProposedCandidate_candidateId_key" ON "ProposedCandidate"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "ViewedCandidate_candidateId_key" ON "ViewedCandidate"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_candidateId_key" ON "Telegram"("candidateId");

-- CreateIndex
CREATE INDEX "_JobToProposedCandidate_B_index" ON "_JobToProposedCandidate"("B");

-- CreateIndex
CREATE INDEX "_JobToViewedCandidate_B_index" ON "_JobToViewedCandidate"("B");

-- CreateIndex
CREATE INDEX "_ProposedCandidateToRecruiter_B_index" ON "_ProposedCandidateToRecruiter"("B");

-- AddForeignKey
ALTER TABLE "ProposedCandidate" ADD CONSTRAINT "ProposedCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewedCandidate" ADD CONSTRAINT "ViewedCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telegram" ADD CONSTRAINT "Telegram_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruiterNotification" ADD CONSTRAINT "RecruiterNotification_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToProposedCandidate" ADD CONSTRAINT "_JobToProposedCandidate_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToProposedCandidate" ADD CONSTRAINT "_JobToProposedCandidate_B_fkey" FOREIGN KEY ("B") REFERENCES "ProposedCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToViewedCandidate" ADD CONSTRAINT "_JobToViewedCandidate_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToViewedCandidate" ADD CONSTRAINT "_JobToViewedCandidate_B_fkey" FOREIGN KEY ("B") REFERENCES "ViewedCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposedCandidateToRecruiter" ADD CONSTRAINT "_ProposedCandidateToRecruiter_A_fkey" FOREIGN KEY ("A") REFERENCES "ProposedCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProposedCandidateToRecruiter" ADD CONSTRAINT "_ProposedCandidateToRecruiter_B_fkey" FOREIGN KEY ("B") REFERENCES "Recruiter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
