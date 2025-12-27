-- Admin Panel Database Migration
-- This script adds necessary columns and indexes for admin panel features

-- Add created_at column to user table if it doesn't exist
ALTER TABLE `user` 
ADD COLUMN IF NOT EXISTS `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have created_at timestamp
UPDATE `user` SET `created_at` = NOW() WHERE `created_at` IS NULL;

-- Add index on user email for faster lookups
ALTER TABLE `user` 
ADD INDEX IF NOT EXISTS `idx_user_email` (`email`);

-- Add index on user role for faster filtering
ALTER TABLE `user` 
ADD INDEX IF NOT EXISTS `idx_user_role` (`role`);

-- Add index on product created_at for faster sorting
ALTER TABLE `product` 
ADD INDEX IF NOT EXISTS `idx_product_created_at` (`created_at`);

-- Add index on product category for faster filtering
ALTER TABLE `product` 
ADD INDEX IF NOT EXISTS `idx_product_category` (`category`);

-- Note: MongoDB indexes should be created via Mongoose schemas
-- The blog and order collections will automatically have indexes on _id
-- You may want to add indexes on frequently queried fields like:
-- db.orders.createIndex({ "status": 1 })
-- db.orders.createIndex({ "user_id": 1 })
-- db.orders.createIndex({ "createdAt": -1 })
-- db.blogs.createIndex({ "category": 1 })
-- db.blogs.createIndex({ "createdAt": -1 })

