/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "PracticeTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "practiceSetId" TEXT NOT NULL,
    "items" JSONB[],
    "totalTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiAnalysis" JSONB,

    CONSTRAINT "PracticeTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AI" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "requestType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AI_userId_idx" ON "AI"("userId");

-- CreateIndex
CREATE INDEX "AI_requestType_idx" ON "AI"("requestType");

-- CreateIndex
CREATE INDEX "AI_provider_idx" ON "AI"("provider");

-- AddForeignKey
ALTER TABLE "PracticeTest" ADD CONSTRAINT "PracticeTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI" ADD CONSTRAINT "AI_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
