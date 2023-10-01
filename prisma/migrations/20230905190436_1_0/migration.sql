-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "wordIds" INTEGER[];

-- CreateTable
CREATE TABLE "_RoomToWord" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToWord_AB_unique" ON "_RoomToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToWord_B_index" ON "_RoomToWord"("B");

-- AddForeignKey
ALTER TABLE "_RoomToWord" ADD CONSTRAINT "_RoomToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToWord" ADD CONSTRAINT "_RoomToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
