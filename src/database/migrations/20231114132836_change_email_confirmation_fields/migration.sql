/*
  Warnings:

  - You are about to drop the column `activationToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ativatedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "activationToken",
DROP COLUMN "ativatedAt",
ADD COLUMN     "emailConfirmedAt" TIMESTAMP(3);
