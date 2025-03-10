-- CreateTable
CREATE TABLE "JobReview" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchScore" INTEGER NOT NULL,
    "missingKeywords" TEXT[],
    "suggestions" TEXT[],

    CONSTRAINT "JobReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobReview" ADD CONSTRAINT "JobReview_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
