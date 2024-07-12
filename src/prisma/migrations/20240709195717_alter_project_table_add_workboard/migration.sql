-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN_BOARD', 'STACK', 'WORKING', 'FINISHED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'OPEN_BOARD';

-- RenameForeignKey
ALTER TABLE "Task" RENAME CONSTRAINT "Task_projectId_fkey" TO "OpenBoardTasks_projectId_fkey";
