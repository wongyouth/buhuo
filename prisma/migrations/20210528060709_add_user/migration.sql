-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SYSTEM', 'STAFF', 'USER', 'WORKER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT E'USER',

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.mobile_unique" ON "User"("mobile");
