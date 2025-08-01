-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `reg_id` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `tld_id` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `reg_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `renew_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `transfer_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promo` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tld_id` INTEGER UNSIGNED NOT NULL,
    `reg_id` INTEGER UNSIGNED NOT NULL,
    `code` VARCHAR(255) NOT NULL DEFAULT '',
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `is_limit` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `is_only_for_new_user` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `type` TINYINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reg` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `status` TINYINT NOT NULL DEFAULT 0,
    `icann_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tld` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL DEFAULT '',
    `status` TINYINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
