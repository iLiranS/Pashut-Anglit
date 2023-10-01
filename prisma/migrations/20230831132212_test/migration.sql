/*
  Warnings:

  - Added the required column `wordLevel` to the `suggestedWord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "suggestedWord" ADD COLUMN     "wordLevel" "wordLevel" NOT NULL;
