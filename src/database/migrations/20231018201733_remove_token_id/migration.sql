/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_refreshToken_key" ON "tokens"("refreshToken");
