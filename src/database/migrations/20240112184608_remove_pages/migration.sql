/*
  Warnings:

  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_userId_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_pageId_fkey";

-- DropTable
DROP TABLE "pages";
