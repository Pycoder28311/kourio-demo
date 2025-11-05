/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bellName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `distanceToDestination` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `validRadius` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    DROP COLUMN `bellName`,
    DROP COLUMN `comment`,
    DROP COLUMN `defaultTime`,
    DROP COLUMN `distanceToDestination`,
    DROP COLUMN `floor`,
    DROP COLUMN `validRadius`;
