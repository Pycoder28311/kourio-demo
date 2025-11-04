-- AlterTable
ALTER TABLE `Barber` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ServiceCategory` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;
