-- AlterTable
ALTER TABLE `User` MODIFY `verifyEmailToken` VARCHAR(191) NULL,
    MODIFY `resetPasswordToken` VARCHAR(191) NULL;
