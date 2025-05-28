/*
  Warnings:

  - You are about to drop the column `andress` on the `patients` table. All the data in the column will be lost.
  - Added the required column `adress` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" DROP COLUMN "andress",
ADD COLUMN     "adress" TEXT NOT NULL;
