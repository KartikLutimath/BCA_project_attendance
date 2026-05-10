-- DropIndex
DROP INDEX `RefreshToken_token_idx` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `token` VARCHAR(512) NOT NULL;
