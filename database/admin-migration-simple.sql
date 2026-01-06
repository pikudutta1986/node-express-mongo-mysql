-- Admin Panel Database Migration (Simple Version)
-- Run this if the dynamic version doesn't work for your MySQL version

-- Add created_at column to user table (comment out if it already exists)
ALTER TABLE `user` ADD COLUMN `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have created_at timestamp
UPDATE `user` SET `created_at` = NOW() WHERE `created_at` IS NULL;

-- Add indexes (uncomment the ones you need)
CREATE INDEX `idx_user_email` ON `user` (`email`);
CREATE INDEX `idx_user_role` ON `user` (`role`);
CREATE INDEX `idx_user_created_at` ON `user` (`created_at`);
CREATE INDEX `idx_product_created_at` ON `product` (`created_at`);
CREATE INDEX `idx_product_category` ON `product` (`category`);

-- If you get "Duplicate key name" errors, the indexes already exist and you can ignore them

