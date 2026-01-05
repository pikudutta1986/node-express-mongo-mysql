-- Settings Table Migration
-- This table stores global application settings

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL UNIQUE,
  `value` text NOT NULL,
  `type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
  `description` text,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert default settings
INSERT INTO `settings` (`key`, `value`, `type`, `description`) VALUES
('site_name', 'Ecommerce Store', 'string', 'Website name'),
('site_email', 'admin@example.com', 'string', 'Contact email address'),
('site_phone', '+1 234 567 8900', 'string', 'Contact phone number'),
('site_address', '123 Main Street, City, Country', 'string', 'Physical address'),
('currency', 'USD', 'string', 'Default currency code'),
('currency_symbol', '$', 'string', 'Currency symbol'),
('tax_rate', '10', 'number', 'Default tax rate percentage'),
('shipping_cost', '5.00', 'number', 'Default shipping cost'),
('free_shipping_threshold', '100', 'number', 'Minimum order amount for free shipping'),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode'),
('max_upload_size', '5242880', 'number', 'Maximum file upload size in bytes (5MB)'),
('items_per_page', '12', 'number', 'Default items per page'),
('enable_registration', 'true', 'boolean', 'Allow new user registration'),
('enable_reviews', 'true', 'boolean', 'Enable product reviews'),
('enable_wishlist', 'true', 'boolean', 'Enable wishlist feature'),
('social_facebook', '', 'string', 'Facebook page URL'),
('social_twitter', '', 'string', 'Twitter profile URL'),
('social_instagram', '', 'string', 'Instagram profile URL'),
('social_linkedin', '', 'string', 'LinkedIn profile URL'),
('meta_title', 'Ecommerce Store - Best Online Shopping', 'string', 'Default meta title'),
('meta_description', 'Shop the best products online', 'string', 'Default meta description'),
('meta_keywords', 'ecommerce, shopping, online store', 'string', 'Default meta keywords'),
('razorpay_key_id', 'rzp_test_1DP5mmOlF5G5ag', 'string', 'Razorpay API Key ID for payment gateway'),
('razorpay_key_secret', 'WXgQyrXx4LzeKm1f57M4urxF', 'string', 'Razorpay API Key Secret for payment gateway')
ON DUPLICATE KEY UPDATE `key`=`key`;

