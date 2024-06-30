-- CreateTable
CREATE TABLE "OpenBoard" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "OpenBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "openBoardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenBoard_projectId_key" ON "OpenBoard"("projectId");

-- AddForeignKey
ALTER TABLE "OpenBoard" ADD CONSTRAINT "OpenBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_openBoardId_fkey" FOREIGN KEY ("openBoardId") REFERENCES "OpenBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
