-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_UserToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToTag_AB_unique" ON "_UserToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToTag_B_index" ON "_UserToTag"("B");

-- AddForeignKey
ALTER TABLE "_UserToTag" ADD CONSTRAINT "_UserToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToTag" ADD CONSTRAINT "_UserToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
