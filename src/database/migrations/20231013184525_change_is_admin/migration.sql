/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "isAdmin";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
