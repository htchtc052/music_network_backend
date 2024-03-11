/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");
