-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 07, 2025 at 06:24 AM
-- Server version: 8.0.43-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demo_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `category` enum('Electronics','Fashion','Living') NOT NULL,
  `price` int NOT NULL,
  `specification` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `images` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `code`, `category`, `price`, `specification`, `description`, `images`, `created_at`) VALUES
(1, 'Smart Electronics Model', 'ELE-1001', 'Electronics', 1822, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Smart Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(2, 'Trendy Fashion Edition', 'FAS-1002', 'Fashion', 97, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Trendy Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(3, 'Eco Living Model', 'LIV-1003', 'Living', 41, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a living product named Eco Living Model. High quality and best in class.', 'https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living2/600/400', '2025-09-06 04:27:14'),
(4, 'Eco Electronics X', 'ELE-1004', 'Electronics', 214, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Eco Electronics X. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(5, 'Smart Fashion Max', 'FAS-1005', 'Fashion', 1955, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Smart Fashion Max. High quality and best in class.', 'https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(6, 'Mega Fashion Max', 'FAS-1006', 'Fashion', 1844, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Mega Fashion Max. High quality and best in class.', 'https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(7, 'Smart Electronics Max', 'ELE-1007', 'Electronics', 417, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Smart Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(8, 'Classic Fashion Model', 'FAS-1008', 'Fashion', 737, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Classic Fashion Model. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion2/600/400', '2025-09-06 04:27:14'),
(9, 'Mega Living Model', 'LIV-1009', 'Living', 1552, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a living product named Mega Living Model. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living3/600/400', '2025-09-06 04:27:14'),
(10, 'Ultra Electronics Pro', 'ELE-1010', 'Electronics', 508, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Ultra Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(11, 'Mega Electronics Edition', 'ELE-1011', 'Electronics', 283, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Mega Electronics Edition. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics1/600/400', '2025-09-06 04:27:14'),
(12, 'Smart Fashion Plus', 'FAS-1012', 'Fashion', 372, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Smart Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(13, 'Super Fashion Lite', 'FAS-1013', 'Fashion', 1061, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Super Fashion Lite. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(14, 'Eco Electronics Max', 'ELE-1014', 'Electronics', 1420, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Eco Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics3/600/400', '2025-09-06 04:27:14'),
(15, 'Mega Electronics Pro', 'ELE-1015', 'Electronics', 1072, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Mega Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(16, 'Mega Fashion Plus', 'FAS-1016', 'Fashion', 833, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a fashion product named Mega Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(17, 'Eco Fashion Max', 'FAS-1017', 'Fashion', 570, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Eco Fashion Max. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(18, 'Classic Living Lite', 'LIV-1018', 'Living', 1078, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a living product named Classic Living Lite. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living2/600/400', '2025-09-06 04:27:14'),
(19, 'Ultra Electronics Edition', 'ELE-1019', 'Electronics', 1864, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Ultra Electronics Edition. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(20, 'Mega Fashion X', 'FAS-1020', 'Fashion', 810, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Mega Fashion X. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(21, 'Ultra Electronics Plus', 'ELE-1021', 'Electronics', 90, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Ultra Electronics Plus. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(22, 'Smart Fashion Pro', 'FAS-1022', 'Fashion', 832, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Smart Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(23, 'Mega Electronics Model', 'ELE-1023', 'Electronics', 1559, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Mega Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics1/600/400', '2025-09-06 04:27:14'),
(24, 'Smart Living Model', 'LIV-1024', 'Living', 1874, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Smart Living Model. High quality and best in class.', 'https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(25, 'Ultra Electronics Max', 'ELE-1025', 'Electronics', 28, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Ultra Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(26, 'Smart Electronics Edition', 'ELE-1026', 'Electronics', 17, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Smart Electronics Edition. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics1/600/400', '2025-09-06 04:27:14'),
(27, 'Smart Fashion Edition', 'FAS-1027', 'Fashion', 755, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Smart Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(28, 'Eco Fashion Edition', 'FAS-1028', 'Fashion', 615, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Eco Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(29, 'Super Electronics Max', 'ELE-1029', 'Electronics', 1216, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Super Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(30, 'Super Fashion Pro', 'FAS-1030', 'Fashion', 1813, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Super Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(31, 'Classic Living X', 'LIV-1031', 'Living', 1429, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a living product named Classic Living X. High quality and best in class.', 'https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living2/600/400', '2025-09-06 04:27:14'),
(32, 'Super Electronics Model', 'ELE-1032', 'Electronics', 743, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Super Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics1/600/400', '2025-09-06 04:27:14'),
(33, 'Trendy Living Pro', 'LIV-1033', 'Living', 55, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a living product named Trendy Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living2/600/400', '2025-09-06 04:27:14'),
(34, 'Smart Electronics Lite', 'ELE-1034', 'Electronics', 1621, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Smart Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics3/600/400', '2025-09-06 04:27:14'),
(35, 'Mega Living Lite', 'LIV-1035', 'Living', 151, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Mega Living Lite. High quality and best in class.', 'https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(36, 'Super Fashion Max', 'FAS-1036', 'Fashion', 1839, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Super Fashion Max. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion2/600/400', '2025-09-06 04:27:14'),
(37, 'Eco Living X', 'LIV-1037', 'Living', 1982, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a living product named Eco Living X. High quality and best in class.', 'https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(38, 'Mega Electronics X', 'ELE-1038', 'Electronics', 786, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Mega Electronics X. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics1/600/400', '2025-09-06 04:27:14'),
(39, 'Mega Fashion Pro', 'FAS-1039', 'Fashion', 1042, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Mega Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(40, 'Super Living X', 'LIV-1040', 'Living', 287, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a living product named Super Living X. High quality and best in class.', 'https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(41, 'Trendy Electronics Lite', 'ELE-1041', 'Electronics', 968, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Trendy Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(42, 'Smart Living Lite', 'LIV-1042', 'Living', 1684, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Smart Living Lite. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living5/600/400', '2025-09-06 04:27:14'),
(43, 'Eco Electronics Edition', 'ELE-1043', 'Electronics', 1140, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Eco Electronics Edition. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(44, 'Classic Electronics Pro', 'ELE-1044', 'Electronics', 818, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Classic Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(45, 'Ultra Living Edition', 'LIV-1045', 'Living', 228, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Ultra Living Edition. High quality and best in class.', 'https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400', '2025-09-06 04:27:14'),
(46, 'Mega Living Pro', 'LIV-1046', 'Living', 762, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Mega Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(47, 'Eco Fashion Plus', 'FAS-1047', 'Fashion', 1979, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Eco Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion2/600/400', '2025-09-06 04:27:14'),
(48, 'Super Electronics Plus', 'ELE-1048', 'Electronics', 753, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Super Electronics Plus. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(49, 'Ultra Electronics Max', 'ELE-1049', 'Electronics', 1674, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Ultra Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics3/600/400', '2025-09-06 04:27:14'),
(50, 'Trendy Electronics Plus', 'ELE-1050', 'Electronics', 1317, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Trendy Electronics Plus. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(51, 'Ultra Fashion Model', 'FAS-1051', 'Fashion', 1288, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Ultra Fashion Model. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(52, 'Smart Electronics Pro', 'ELE-1052', 'Electronics', 1387, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Smart Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(53, 'Trendy Living X', 'LIV-1053', 'Living', 1287, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Trendy Living X. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(54, 'Mega Electronics Pro', 'ELE-1054', 'Electronics', 1624, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Mega Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(55, 'Smart Fashion Model', 'FAS-1055', 'Fashion', 917, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Smart Fashion Model. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(56, 'Super Electronics Pro', 'ELE-1056', 'Electronics', 1698, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Super Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(57, 'Ultra Electronics Pro', 'ELE-1057', 'Electronics', 1297, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Ultra Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(58, 'Smart Electronics Pro', 'ELE-1058', 'Electronics', 1012, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Smart Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(59, 'Mega Electronics Model', 'ELE-1059', 'Electronics', 580, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a electronics product named Mega Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(60, 'Ultra Electronics Max', 'ELE-1060', 'Electronics', 22, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Ultra Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(61, 'Classic Fashion Pro', 'FAS-1061', 'Fashion', 1800, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Classic Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion2/600/400', '2025-09-06 04:27:14'),
(62, 'Smart Fashion Edition', 'FAS-1062', 'Fashion', 240, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a fashion product named Smart Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(63, 'Eco Fashion Plus', 'FAS-1063', 'Fashion', 1637, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a fashion product named Eco Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(64, 'Smart Electronics X', 'ELE-1064', 'Electronics', 463, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Smart Electronics X. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(65, 'Smart Electronics Model', 'ELE-1065', 'Electronics', 1079, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Smart Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(66, 'Ultra Living Pro', 'LIV-1066', 'Living', 1033, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Ultra Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living5/600/400', '2025-09-06 04:27:14'),
(67, 'Mega Electronics Edition', 'ELE-1067', 'Electronics', 690, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Mega Electronics Edition. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400', '2025-09-06 04:27:14'),
(68, 'Trendy Fashion Pro', 'FAS-1068', 'Fashion', 681, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a fashion product named Trendy Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(69, 'Trendy Fashion Plus', 'FAS-1069', 'Fashion', 889, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Trendy Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(70, 'Eco Fashion Edition', 'FAS-1070', 'Fashion', 1556, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a fashion product named Eco Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(71, 'Mega Living Pro', 'LIV-1071', 'Living', 1017, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a living product named Mega Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(72, 'Eco Electronics Model', 'ELE-1072', 'Electronics', 88, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Eco Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(73, 'Mega Electronics Lite', 'ELE-1073', 'Electronics', 788, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Mega Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(74, 'Mega Living Lite', 'LIV-1074', 'Living', 1069, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Mega Living Lite. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(75, 'Trendy Living Pro', 'LIV-1075', 'Living', 1946, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a living product named Trendy Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living3/600/400', '2025-09-06 04:27:14'),
(76, 'Trendy Electronics Lite', 'ELE-1076', 'Electronics', 909, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Trendy Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(77, 'Eco Electronics Max', 'ELE-1077', 'Electronics', 1983, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Eco Electronics Max. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics3/600/400', '2025-09-06 04:27:14'),
(78, 'Super Living Model', 'LIV-1078', 'Living', 792, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Super Living Model. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(79, 'Super Living Max', 'LIV-1079', 'Living', 1407, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a living product named Super Living Max. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living3/600/400', '2025-09-06 04:27:14'),
(80, 'Ultra Electronics Plus', 'ELE-1080', 'Electronics', 21, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Ultra Electronics Plus. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(81, 'Mega Electronics Pro', 'ELE-1081', 'Electronics', 1015, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a electronics product named Mega Electronics Pro. High quality and best in class.', 'https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics3/600/400', '2025-09-06 04:27:14'),
(82, 'Eco Living Max', 'LIV-1082', 'Living', 359, 'Color: Red | Size: Medium | Warranty: 1 Year', 'This is a living product named Eco Living Max. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living5/600/400', '2025-09-06 04:27:14'),
(83, 'Eco Living Edition', 'LIV-1083', 'Living', 1297, 'Battery: 4000mAh | Weight: 1.2kg | Connectivity: WiFi', 'This is a living product named Eco Living Edition. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14'),
(84, 'Ultra Living Model', 'LIV-1084', 'Living', 285, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Ultra Living Model. High quality and best in class.', 'https://picsum.photos/seed/living1/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living5/600/400', '2025-09-06 04:27:14'),
(85, 'Super Living Edition', 'LIV-1085', 'Living', 709, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Super Living Edition. High quality and best in class.', 'https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(86, 'Mega Electronics Lite', 'ELE-1086', 'Electronics', 590, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Mega Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400 | https://picsum.photos/seed/electronics5/600/400', '2025-09-06 04:27:14'),
(87, 'Ultra Fashion Plus', 'FAS-1087', 'Fashion', 1621, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Ultra Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(88, 'Super Electronics Lite', 'ELE-1088', 'Electronics', 1164, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Super Electronics Lite. High quality and best in class.', 'https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(89, 'Eco Fashion Model', 'FAS-1089', 'Fashion', 1158, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Eco Fashion Model. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(90, 'Eco Fashion Edition', 'FAS-1090', 'Fashion', 867, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Eco Fashion Edition. High quality and best in class.', 'https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion2/600/400', '2025-09-06 04:27:14'),
(91, 'Super Electronics X', 'ELE-1091', 'Electronics', 914, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a electronics product named Super Electronics X. High quality and best in class.', 'https://picsum.photos/seed/electronics1/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(92, 'Super Living X', 'LIV-1092', 'Living', 120, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a living product named Super Living X. High quality and best in class.', 'https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(93, 'Eco Fashion Plus', 'FAS-1093', 'Fashion', 593, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a fashion product named Eco Fashion Plus. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion1/600/400', '2025-09-06 04:27:14'),
(94, 'Classic Living Max', 'LIV-1094', 'Living', 1087, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a living product named Classic Living Max. High quality and best in class.', 'https://picsum.photos/seed/living4/600/400 | https://picsum.photos/seed/living3/600/400 | https://picsum.photos/seed/living1/600/400', '2025-09-06 04:27:14'),
(95, 'Super Electronics Model', 'ELE-1095', 'Electronics', 628, 'Power: 220V | Warranty: 2 Years | Brand: Generic', 'This is a electronics product named Super Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics3/600/400 | https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(96, 'Classic Fashion Lite', 'FAS-1096', 'Fashion', 333, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a fashion product named Classic Fashion Lite. High quality and best in class.', 'https://picsum.photos/seed/fashion3/600/400 | https://picsum.photos/seed/fashion1/600/400 | https://picsum.photos/seed/fashion5/600/400', '2025-09-06 04:27:14'),
(97, 'Classic Electronics Model', 'ELE-1097', 'Electronics', 1966, 'Material: Cotton | Gender: Unisex | Country: India', 'This is a electronics product named Classic Electronics Model. High quality and best in class.', 'https://picsum.photos/seed/electronics5/600/400 | https://picsum.photos/seed/electronics4/600/400 | https://picsum.photos/seed/electronics2/600/400', '2025-09-06 04:27:14'),
(98, 'Trendy Fashion Pro', 'FAS-1098', 'Fashion', 1687, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Trendy Fashion Pro. High quality and best in class.', 'https://picsum.photos/seed/fashion4/600/400 | https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(99, 'Eco Fashion Max', 'FAS-1099', 'Fashion', 1907, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a fashion product named Eco Fashion Max. High quality and best in class.', 'https://picsum.photos/seed/fashion2/600/400 | https://picsum.photos/seed/fashion5/600/400 | https://picsum.photos/seed/fashion3/600/400', '2025-09-06 04:27:14'),
(100, 'Classic Living Pro', 'LIV-1100', 'Living', 1811, 'Resolution: 1080p | Screen: 6.5 inch | RAM: 8GB', 'This is a living product named Classic Living Pro. High quality and best in class.', 'https://picsum.photos/seed/living2/600/400 | https://picsum.photos/seed/living5/600/400 | https://picsum.photos/seed/living4/600/400', '2025-09-06 04:27:14');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `role` enum('ADMIN','CUSTOMER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'CUSTOMER',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `role`, `name`, `email`, `password`) VALUES
(1, 'CUSTOMER', 'Anindya Dutta', 'dutta.ani007@gmail.com', '$2b$10$SFvJ0APsUEXtRFuGODswTujIXplIHt53ZlNbigBk1om6WTh0BIMn6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
