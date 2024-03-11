/*
  Warnings:

  - Added the required column `pageId` to the `tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "pageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
