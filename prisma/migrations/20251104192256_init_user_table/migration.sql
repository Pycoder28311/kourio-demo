-- CreateTable
CREATE TABLE `Barbershop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `distance` DOUBLE NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BarbershopWeeklySchedule` (
    `barbershopId` INTEGER NOT NULL,
    `scheduleId` INTEGER NOT NULL,

    PRIMARY KEY (`barbershopId`, `scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BarbershopDateOverride` (
    `barbershopId` INTEGER NOT NULL,
    `dateOverrideId` INTEGER NOT NULL,

    PRIMARY KEY (`barbershopId`, `dateOverrideId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BarbershopServiceCategories` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BarbershopServiceCategories_AB_unique`(`A`, `B`),
    INDEX `_BarbershopServiceCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BarbershopWeeklySchedule` ADD CONSTRAINT `BarbershopWeeklySchedule_barbershopId_fkey` FOREIGN KEY (`barbershopId`) REFERENCES `Barbershop`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarbershopWeeklySchedule` ADD CONSTRAINT `BarbershopWeeklySchedule_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `WeeklySchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarbershopDateOverride` ADD CONSTRAINT `BarbershopDateOverride_barbershopId_fkey` FOREIGN KEY (`barbershopId`) REFERENCES `Barbershop`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BarbershopDateOverride` ADD CONSTRAINT `BarbershopDateOverride_dateOverrideId_fkey` FOREIGN KEY (`dateOverrideId`) REFERENCES `DateScheduleOverride`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BarbershopServiceCategories` ADD CONSTRAINT `_BarbershopServiceCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `Barbershop`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BarbershopServiceCategories` ADD CONSTRAINT `_BarbershopServiceCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `ServiceCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
