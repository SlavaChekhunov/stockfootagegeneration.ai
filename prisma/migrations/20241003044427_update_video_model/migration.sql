/*
  Warnings:

  - You are about to drop the column `endFrameImageId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `sourceImageId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_endFrameImageId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_sourceImageId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "endFrameImageId",
DROP COLUMN "sourceImageId",
ADD COLUMN     "sourceImageUrl" TEXT;

-- DropTable
DROP TABLE "Image";
