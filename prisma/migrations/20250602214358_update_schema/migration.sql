/*
  Warnings:

  - You are about to drop the `PracticeTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PracticeTest" DROP CONSTRAINT "PracticeTest_userId_fkey";

-- DropTable
DROP TABLE "PracticeTest";

-- CreateTable
CREATE TABLE "PracticeAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "feedback" TEXT,
    "score" INTEGER,
    "suggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeAnswer_userId_idx" ON "PracticeAnswer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeAnswer_userId_questionId_key" ON "PracticeAnswer"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "PracticeAnswer" ADD CONSTRAINT "PracticeAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
