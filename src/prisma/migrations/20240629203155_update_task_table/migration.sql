/*
  Warnings:

  - Added the required column `task` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "task" TEXT NOT NULL;
