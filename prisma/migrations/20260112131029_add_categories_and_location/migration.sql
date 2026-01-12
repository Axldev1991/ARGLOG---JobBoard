/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "updatedAt",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Otros',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "modality" TEXT NOT NULL DEFAULT 'Remoto';
