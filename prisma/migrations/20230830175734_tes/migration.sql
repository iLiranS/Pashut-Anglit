-- CreateEnum
CREATE TYPE "wordLevel" AS ENUM ('easy', 'medium', 'hard', 'impossible');

-- CreateEnum
CREATE TYPE "userLevel" AS ENUM ('Novice', 'Rookie', 'Skilled', 'Expert', 'Master');

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "translate" TEXT NOT NULL,
    "level" "wordLevel" NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "userLevel" NOT NULL,
    "exp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "words" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duelScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestedWord" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "translate" TEXT NOT NULL,

    CONSTRAINT "suggestedWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "usersId" TEXT[],
    "user1" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "user2" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "stage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoomToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_key" ON "Word"("word");

-- CreateIndex
CREATE UNIQUE INDEX "suggestedWord_word_key" ON "suggestedWord"("word");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToUser_AB_unique" ON "_RoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToUser_B_index" ON "_RoomToUser"("B");

-- AddForeignKey
ALTER TABLE "_RoomToUser" ADD CONSTRAINT "_RoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomToUser" ADD CONSTRAINT "_RoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
