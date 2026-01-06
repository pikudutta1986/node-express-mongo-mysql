-- Admin Panel Database Migration
-- This script adds necessary columns and indexes for admin panel features

-- Check if created_at column exists, if not add it
-- Note: MySQL doesn't support IF NOT EXISTS for columns, so we'll handle errors gracefully
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'user'
    AND COLUMN_NAME = 'created_at'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `user` ADD COLUMN `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP',
    'SELECT "Column created_at already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing users to have created_at timestamp
UPDATE `user` SET `created_at` = NOW() WHERE `created_at` IS NULL;

-- Add index on user email for faster lookups
CREATE INDEX IF NOT EXISTS `idx_user_email` ON `user` (`email`);

-- Add index on user role for faster filtering
CREATE INDEX IF NOT EXISTS `idx_user_role` ON `user` (`role`);

-- Add index on user created_at for dashboard user growth queries
CREATE INDEX IF NOT EXISTS `idx_user_created_at` ON `user` (`created_at`);

-- Add index on product created_at for faster sorting
CREATE INDEX IF NOT EXISTS `idx_product_created_at` ON `product` (`created_at`);

-- Add index on product category for faster filtering
CREATE INDEX IF NOT EXISTS `idx_product_category` ON `product` (`category`);

-- Note: MongoDB indexes should be created via Mongoose schemas
-- The blog and order collections will automatically have indexes on _id
-- You may want to add indexes on frequently queried fields like:
-- db.orders.createIndex({ "status": 1 })
-- db.orders.createIndex({ "user_id": 1 })
-- db.orders.createIndex({ "createdAt": -1 })
-- db.blogs.createIndex({ "category": 1 })
-- db.blogs.createIndex({ "createdAt": -1 })
