/*
  Warnings:

  - You are about to drop the column `openBoardId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `OpenBoard` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OpenBoard" DROP CONSTRAINT "OpenBoard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_openBoardId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "openBoardId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OpenBoard";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
