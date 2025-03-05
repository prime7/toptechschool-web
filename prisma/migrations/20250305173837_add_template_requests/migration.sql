/*
  Warnings:

  - You are about to drop the column `atsAnalysis` on the `Resume` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "JobRole" AS ENUM ('SOFTWARE_ENGINEER', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULLSTACK_DEVELOPER', 'DEVOPS_ENGINEER', 'QA_ENGINEER', 'DATA_SCIENTIST', 'DATA_ENGINEER', 'MACHINE_LEARNING_ENGINEER', 'PRODUCT_MANAGER', 'PROJECT_MANAGER', 'SCRUM_MASTER', 'UI_UX_DESIGNER', 'SYSTEM_ADMINISTRATOR', 'SECURITY_ENGINEER', 'DATABASE_ADMINISTRATOR');

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "atsAnalysis",
ADD COLUMN     "analysis" JSONB,
ADD COLUMN     "jobRole" "JobRole";

-- CreateTable
CREATE TABLE "TemplateRequests" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateRequests_email_key" ON "TemplateRequests"("email");
