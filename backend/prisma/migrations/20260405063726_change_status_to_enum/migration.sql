/*
  Warnings:

  - The `status` column on the `ShoppingList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ListStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "ShoppingList" DROP COLUMN "status",
ADD COLUMN     "status" "ListStatus" NOT NULL DEFAULT 'ACTIVE';
