/*
  Warnings:

  - The primary key for the `Rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_RoomMembers" DROP CONSTRAINT "_RoomMembers_A_fkey";

-- AlterTable
ALTER TABLE "Rooms" DROP CONSTRAINT "Rooms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rooms_id_seq";

-- AlterTable
ALTER TABLE "_RoomMembers" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_RoomMembers" ADD CONSTRAINT "_RoomMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
