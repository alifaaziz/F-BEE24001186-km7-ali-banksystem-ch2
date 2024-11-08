/*
  Warnings:

  - You are about to drop the column `imageDescription` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `imageTitle` on the `images` table. All the data in the column will be lost.
  - Added the required column `description` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `images` table without a default value. This is not possible if the table is not empty.
  - Made the column `imageUrl` on table `images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "imageDescription",
DROP COLUMN "imageTitle",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
