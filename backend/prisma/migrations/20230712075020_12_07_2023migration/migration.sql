/*
  Warnings:

  - A unique constraint covering the columns `[postContentId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postContentId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewImageCover` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postContentId" INTEGER NOT NULL,
ADD COLUMN     "previewImageCover" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PostContent" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PostContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_postContentId_key" ON "Post"("postContentId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postContentId_fkey" FOREIGN KEY ("postContentId") REFERENCES "PostContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
