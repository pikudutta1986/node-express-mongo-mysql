/*
 Navicat MySQL Data Transfer

 Source Server         : ATTOTRAIN
 Source Server Type    : MySQL
 Source Server Version : 100148
 Source Host           : www.attotrain.com:3306
 Source Schema         : attotrain_main

 Target Server Type    : MySQL
 Target Server Version : 100148
 File Encoding         : 65001

 Date: 02/06/2021 11:34:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for alert
-- ----------------------------
DROP TABLE IF EXISTS `alert`;
CREATE TABLE `alert`  (
  `alert_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | Alerts are delivered in the tablet or mobile app, possibly with email announcements.',
  `alerttype_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | alerttype | There are all kinds of alerts; a system notification that the server will be down, signing up for a course but failing to initiate it, etc.',
  `to_user_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | user | The user who received the alert.',
  `alert` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Text of the alert itself. It could be said this column is unnecessary, since it duplicates the text contained at <alerttype.alert>, but that text could be edited over time, so this is here for historical purposes.',
  `responsestatus` enum('T','S','D','R','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'T = Transmitted, Not seen | S = Seen (User saw it, did nothing) | D = Dismissed by user (User saw it, dismissed it) | R = User responded | E = Expired (alerts older than SV-ALERT-AUTODISMISS-MAX = 11 days are not shown).',
  `datetimesent` datetime(0) NULL DEFAULT NULL COMMENT 'When the alert was sent.',
  `datetimeresponse` datetime(0) NULL DEFAULT NULL COMMENT 'When the alert was responded to, if applicable.',
  PRIMARY KEY (`alert_id`) USING BTREE,
  INDEX `idx-fk-normal-alert-alerttype_id`(`alerttype_id`) USING BTREE,
  CONSTRAINT `fk-alert-alerttype_id` FOREIGN KEY (`alerttype_id`) REFERENCES `alerttype` (`alerttype_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of alert
-- ----------------------------

-- ----------------------------
-- Table structure for alerttype
-- ----------------------------
DROP TABLE IF EXISTS `alerttype`;
CREATE TABLE `alerttype`  (
  `alerttype_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PK | Type of alert.',
  `alerttype` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Friendly name that appears in the interface.',
  `alert` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The text of the alert to be sent to the tablet or mobile app.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'For the programmer, a description of the alert and its significance.',
  PRIMARY KEY (`alerttype_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of alerttype
-- ----------------------------
INSERT INTO `alerttype` VALUES ('MC', 'Missed Call', NULL, 'Sent if a person has missed calls the previous day. This amalgamates the number of calls that were missed and sends as a daily alert. The button choice here is a single choice, which is Okay.');
INSERT INTO `alerttype` VALUES ('PR', 'Phone Routing', '[$namefirst + $namelast] wants to permanently transfer his calls to you.', 'This alert is sent when one person wants to more or less permanently route their phone calls to another person.');

-- ----------------------------
-- Table structure for asset
-- ----------------------------
DROP TABLE IF EXISTS `asset`;
CREATE TABLE `asset`  (
  `asset_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | Assets like PDFs, MP4s and FlipDecks are associated with concepts and are in fact used to teach those concepts. They can also be resources used in supporting job roles.',
  `assettype_id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | The type of asset.',
  `flipdeck_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'FK | If assettype = FD (Flipdeck), this must be populated, otherwise it must be null.',
  `asset` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The name of the asset, shown as a title in some contexts.',
  `asseturl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Some assets, like external videos and articles, have external urls. Others, such as images, have internal urls. Some, like flipdecks, have no urls (so null allowed). The path to the asset, including the filename of the asset, whether on the server or else on the internet.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description for internal use only.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimecreated` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`asset_id`) USING BTREE,
  INDEX `idx-fk-normal-asset-flipdeck_id`(`flipdeck_id`) USING BTREE,
  INDEX `idx-fk-normal-asset-assettype_id`(`assettype_id`) USING BTREE,
  CONSTRAINT `fk-asset-assettype_id` FOREIGN KEY (`assettype_id`) REFERENCES `assettype` (`assettype_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-asset-flipdeck_id` FOREIGN KEY (`flipdeck_id`) REFERENCES `flipdeck` (`flipdeck_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset
-- ----------------------------

-- ----------------------------
-- Table structure for asset_role
-- ----------------------------
DROP TABLE IF EXISTS `asset_role`;
CREATE TABLE `asset_role`  (
  `asset_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | An asset can be used as a resource also. One asset is associated with many roles.',
  `role_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | One role has many assets to be used as resources.',
  INDEX `idx-fk-normal-asset_role-asset_id`(`asset_id`) USING BTREE,
  INDEX `idx-fk-normal-asset_role-role_id`(`role_id`) USING BTREE,
  CONSTRAINT `fk-asset_role-asset_id` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`asset_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-asset_role-role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of asset_role
-- ----------------------------

-- ----------------------------
-- Table structure for assettype
-- ----------------------------
DROP TABLE IF EXISTS `assettype`;
CREATE TABLE `assettype`  (
  `assettype_id` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'An asset type is not a file type, but a semantic type. For example, an image, not a .png or .jpg.',
  `assettype` enum('I','V','S','QRG','FD','H','LAB','SIM','WIKI','WEB') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'I = Image | V = Video | S= Sound | QRG = Quick Reference Guide | FD = Flip Deck | H = Handout | LAB = Lab | SIM = Simulation (Storyline output) | WIKI = Wikipedia Article | WEB = Web Article ',
  `filetype` enum('PDF','MP3','MP4','TXT','SQL') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'The filetype, as defined by its extension.',
  `mode` enum('R','C','B','N') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'N' COMMENT 'How the asset has been utilized. If R, the Asset has only been created as a Resource. If C, the Asset is associated only with a Concept. If B, the Asset has been associated with both Resources and Concepts. If N for Neither(Default), the Asset has not yet been linked as either.',
  `logourl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'If there is a logo, the url to that logo.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`assettype_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of assettype
-- ----------------------------

-- ----------------------------
-- Table structure for authtoken
-- ----------------------------
DROP TABLE IF EXISTS `authtoken`;
CREATE TABLE `authtoken`  (
  `authtoken_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | This table stores tokens which allow users to enter their username and password in order to obtain a token which allows them to fetch a specific resource without using their username and password.',
  `selector` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Use 9 bytes of random data (base64 encoded to 12 characters) for the selector to create the hashed token',
  `token` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Token generated using SHA256 hash of the authenticator. We use 33 bytes (264 bits) of randomness for the actual authenticator.',
  `useremail` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User mail can be used for validation.',
  `expires` datetime(0) NULL DEFAULT NULL COMMENT 'Expiration date for this cookie.',
  PRIMARY KEY (`authtoken_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of authtoken
-- ----------------------------

-- ----------------------------
-- Table structure for concept
-- ----------------------------
DROP TABLE IF EXISTS `concept`;
CREATE TABLE `concept`  (
  `concept_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'A course is made of units, which are made of modules, sometimes containing conceptgroups, which are made of concepts, which are associated with assets. A concept is the base unit of instruction, either a single word or a phrase, essentially any idea that could be a topic for a wikipedia article, like (social engineer), (pen test), or (typos quatting).',
  `parent_concept_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'Concepts can exist in a hierarchy. If the concept is [state], the parent concept is [country]. If the concept is [city], the parent concept is [state]. If the concept is [dog], the parent concept is [animal] (or Kingdom).',
  `conceptgroup_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'Concepts can exist in groups. If the module is [Attacks], a concept could be [Phishing], which could be presented by itself, or bundled with similar concepts under the umbrella group [Social Engineering].',
  `concept` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The concept itself, like [Phishing] or [Smishing] or [Blockchain].',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description of the concept.',
  `activestatus` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimemodified` datetime(0) NULL DEFAULT NULL COMMENT 'The date and time the last modification was made.',
  PRIMARY KEY (`concept_id`) USING BTREE,
  INDEX `idx-fk-normal-concept-parent_concept_id`(`parent_concept_id`) USING BTREE,
  INDEX `idx-fk-normal-concept-conceptgroup_id`(`conceptgroup_id`) USING BTREE,
  CONSTRAINT `fk-concept-conceptgroup_id` FOREIGN KEY (`conceptgroup_id`) REFERENCES `conceptgroup` (`conceptgroup_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-concept-parent_concept_id` FOREIGN KEY (`parent_concept_id`) REFERENCES `concept` (`concept_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of concept
-- ----------------------------

-- ----------------------------
-- Table structure for concept_asset
-- ----------------------------
DROP TABLE IF EXISTS `concept_asset`;
CREATE TABLE `concept_asset`  (
  `concept_id` int(11) UNSIGNED NOT NULL COMMENT 'PK | A concept is typically explained, exemplified, described, or communicated with many assets.',
  `asset_id` int(11) UNSIGNED NOT NULL COMMENT 'A single asset, such as a picture of a globe, can be associated with many concepts.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Description for the programmer.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive | If I, this association has been temporarily removed.',
  `datetimemodified` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`concept_id`, `asset_id`) USING BTREE,
  INDEX `idx-fk-normal-concept_asset-asset_id`(`asset_id`) USING BTREE,
  INDEX `idx-fk-normal-concept_asset-concept_id`(`concept_id`) USING BTREE,
  CONSTRAINT `fk-concept_asset-asset_id` FOREIGN KEY (`asset_id`) REFERENCES `asset` (`asset_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-concept_asset-concept_id` FOREIGN KEY (`concept_id`) REFERENCES `concept` (`concept_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of concept_asset
-- ----------------------------

-- ----------------------------
-- Table structure for conceptgroup
-- ----------------------------
DROP TABLE IF EXISTS `conceptgroup`;
CREATE TABLE `conceptgroup`  (
  `conceptgroup_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | Just what it says, a group of concepts. These appear as buttons inside the module. When clicked, the concepts run as tabs on the top.',
  `conceptgroup` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The name of the concept group, e.g. [Social Engineering].',
  PRIMARY KEY (`conceptgroup_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of conceptgroup
-- ----------------------------

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `course_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | A course is not a grab bag of articles or topics which can be viewed in any order, but much like a powerpoint deck or chapters in a book, it is typically and most effectively presented in a sequence, one topic building upon the other. A course consists of one or more units, which are made up of one or more modules, in turn made up of one or more concepts (sometimes within concept groups), to which are attached one or more assets for explanatory purposes.',
  `prerequisite_course_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The course, if any, that must be passed before this course is taken. Null allowed.',
  `modifier_user_id` int(11) UNSIGNED NOT NULL COMMENT 'The user who last modified the course.',
  `course` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the course.',
  `quizzesrequired` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'Rolled up from the sum of course_unit_module. Historical data and not necessarily redundant.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description of the course.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive (If I, this association has been removed.)',
  `datetimecreated` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`course_id`) USING BTREE,
  INDEX `idx-fk-normal-course-modifier_user_id`(`modifier_user_id`) USING BTREE,
  CONSTRAINT `fk-course-modifier_user_id` FOREIGN KEY (`modifier_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of course
-- ----------------------------

-- ----------------------------
-- Table structure for course_role
-- ----------------------------
DROP TABLE IF EXISTS `course_role`;
CREATE TABLE `course_role`  (
  `course_id` int(11) UNSIGNED NOT NULL COMMENT 'Which course is associated with which role. One course can be associated with many roles.',
  `role_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'A job role, such as tech support, sales rep, or admin, which can be associated with many courses.',
  `requiredstatus` enum('R','O') CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT 'R' COMMENT 'Whether or not the course is required for that role, or optional. If the association is not here made, the student CANNOT take that course. R = Required (Default) | O = Optional (user can take course, but not required).',
  INDEX `idx-fk-normal-course_role-course_id`(`course_id`) USING BTREE,
  INDEX `idx-fk-normal-course_role-role_id`(`role_id`) USING BTREE,
  CONSTRAINT `fk-course_role-course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-course_role-role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of course_role
-- ----------------------------

-- ----------------------------
-- Table structure for course_unit_module
-- ----------------------------
DROP TABLE IF EXISTS `course_unit_module`;
CREATE TABLE `course_unit_module`  (
  `course_unit_module_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` int(11) UNSIGNED NOT NULL COMMENT 'A course has many units and modules. This table defines the course itself, its structure and linear path.',
  `unit_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The unit that contains the module.',
  `module_id` int(11) UNSIGNED NOT NULL COMMENT 'The module within the unit and course.',
  `conceptstotal` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'Total number of concepts in this module.',
  `order` tinyint(4) UNSIGNED NOT NULL COMMENT 'The order of the module in the course.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive | If I, this association has been removed.',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`course_unit_module_id`) USING BTREE,
  INDEX `idx-fk-normal-module_course-module_id`(`module_id`) USING BTREE,
  INDEX `idx-fk-normal-module_course-course_id`(`course_id`) USING BTREE,
  INDEX `idx-fk-normal-course_unit_module-unit_id`(`unit_id`) USING BTREE,
  CONSTRAINT `fk-course_unit_module-unit_id` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`unit_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-module_course-course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-module_course-module_id` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of course_unit_module
-- ----------------------------

-- ----------------------------
-- Table structure for enrollment
-- ----------------------------
DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE `enrollment`  (
  `enrollment_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | A course is only actualized when a student takes it. Every student in a role is auto-enrolled in that course if course_role.requiredstatus = R. They are allowed, but not required, to take the course when .requiredstatus = 0. Functionally identical to and replaces the junction table course_user. Progress for the user through enrollment is measured by the enrollmentprogress table.',
  `admin_user_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | user | Admin who last modified the enrollment.',
  `student_user_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'FK | user | The student enrolled in the course.',
  `course_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'FK | course | The course in which the student is enrolled.',
  `quizzesrequired` tinyint(4) UNSIGNED NULL DEFAULT NULL COMMENT 'Number of quizzes required to complete the course, originally populated from course.quizzesrequired. Not redundant, because this is a snapshot of data that can change over time.',
  `quizzescompleted` tinyint(4) UNSIGNED NULL DEFAULT NULL COMMENT 'How many quizzes the student has completed, useful for comparison purposes to show progress.',
  `score` tinyint(4) UNSIGNED NULL DEFAULT NULL COMMENT 'The average rolled-up score from enrollmentprogress.score and quizuser.score.',
  `completionstatus` enum('N','I','C') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'N' COMMENT 'N = Not Started (Default) | I = In Progress (enrollment.quizzescompleted < enrollment.quizzesrequired) | C = Completed. If C, enrollment.quizzescompleted = enrollment.quizzesrequired.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimestarted` datetime(0) NULL DEFAULT NULL COMMENT 'The date and the time of the course started.',
  `datetimecreated` datetime(0) NULL DEFAULT NULL,
  `datetimedropped` datetime(0) NULL DEFAULT NULL COMMENT 'Records when the student dropped the course if that indeed occurred. Allows nulls.',
  PRIMARY KEY (`enrollment_id`) USING BTREE,
  INDEX `idx-fk-normal-enrollment-user_id`(`student_user_id`) USING BTREE,
  INDEX `idx-fk-normal-enrollment-course_id`(`course_id`) USING BTREE,
  INDEX `idx-fk-normal-enrollment-modifier_user_id`(`admin_user_id`) USING BTREE,
  CONSTRAINT `fk-enrollment-admin_user_id` FOREIGN KEY (`admin_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-enrollment-course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-enrollment-student_user_id` FOREIGN KEY (`student_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of enrollment
-- ----------------------------

-- ----------------------------
-- Table structure for enrollmentprogress
-- ----------------------------
DROP TABLE IF EXISTS `enrollmentprogress`;
CREATE TABLE `enrollmentprogress`  (
  `enrollmentprogress_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'This table tracks the progress of a student through a course for bookmarking purposes. Data for this table rolled up from quizuser table.',
  `enrollment_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The enrollment being tracked.',
  `course_unit_module_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The module within which progress is being made.',
  `completionstatus` enum('N','I','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT 'N = Not started (Default) | I = In progress | P = Passed.',
  `totalmodules` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Total modules in course_unit_module for that course at the time the record was created. Historical data and not necessarily redundant.',
  `modulescompleted` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Modules completed so far by the user.',
  `score` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The last quiz score for that module.',
  `conceptscurrent` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT ' Current number of concepts completed by the user.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive | If I, the user has been unassigned from this module (this will rarely, if ever, happen.)',
  `datetimestarted` datetime(0) NOT NULL COMMENT 'The date and the time the module started.',
  `datetimelastinteraction` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'The date and time of the last interaction.',
  `datetimefinished` datetime(0) NOT NULL COMMENT 'The date and the time of the module completion.',
  `datetimemodified` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`enrollmentprogress_id`) USING BTREE,
  INDEX `idx-fk-normal-enrollmentprogress-enrollment_id`(`enrollment_id`) USING BTREE,
  INDEX `idx-fk-normal-enrollmentprogress-course_unit_module_id`(`course_unit_module_id`) USING BTREE,
  CONSTRAINT `fk-enrollmentprogress-course_unit_module_id` FOREIGN KEY (`course_unit_module_id`) REFERENCES `course_unit_module` (`course_unit_module_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-enrollmentprogress-enrollment_id` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`enrollment_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of enrollmentprogress
-- ----------------------------

-- ----------------------------
-- Table structure for flipcard
-- ----------------------------
DROP TABLE IF EXISTS `flipcard`;
CREATE TABLE `flipcard`  (
  `flipcard_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'A flip deck holds flip cards. The order of the cards in a deck is not important. Each card has a question and answer side. The user can change the mode of presentation, front(question or term) or back (answer or definition) first. ',
  `flipdeck_id` int(11) UNSIGNED NOT NULL COMMENT 'The deck that holds the cards.',
  `front` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Content for front of card, usually a question or acronym or term or image.',
  `back` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Content for back of card, usually answer, phrase, definition, or word.',
  `frontimageurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'If there is an image, url to the front. Null allowed.',
  `backimageurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'If there is an image, url to the back. Null allowed.',
  `activestatus` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`flipcard_id`) USING BTREE,
  INDEX `idx-fk-normal-flipcard-flipdeck_id`(`flipdeck_id`) USING BTREE,
  CONSTRAINT `fk-flipcard-flipdeck_id` FOREIGN KEY (`flipdeck_id`) REFERENCES `flipdeck` (`flipdeck_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of flipcard
-- ----------------------------

-- ----------------------------
-- Table structure for flipdeck
-- ----------------------------
DROP TABLE IF EXISTS `flipdeck`;
CREATE TABLE `flipdeck`  (
  `flipdeck_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'A flipdeck, unlike a powerpoint deck, is not designed in a linear sequence and can be shuffled in any order. Parent table to child flipcard table, since a deck holds flipcards.',
  `creator_user_id` int(11) UNSIGNED NOT NULL COMMENT 'Creator of the flipdeck.',
  `flipdeck` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Title of the flipdeck.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'For both programmer and user.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimecreated` datetime(0) NULL DEFAULT NULL,
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`flipdeck_id`) USING BTREE,
  INDEX `idx-fk-normal-flipdeck-creator_user_id`(`creator_user_id`) USING BTREE,
  CONSTRAINT `fk-flipdeck-creator_user_id` FOREIGN KEY (`creator_user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of flipdeck
-- ----------------------------

-- ----------------------------
-- Table structure for log-login
-- ----------------------------
DROP TABLE IF EXISTS `log-login`;
CREATE TABLE `log-login`  (
  `log-login_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | Maintains a history of logins.',
  `user_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | user | The user who logged in.',
  `datetimeoccurred` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time the login occurred.',
  PRIMARY KEY (`log-login_id`) USING BTREE,
  INDEX `idx-fk-normal-log-login-user_id`(`user_id`) USING BTREE,
  CONSTRAINT `fk-log-login-user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of log-login
-- ----------------------------

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `message_id` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PK | A message displayed on the application page to give error or success messages to the users.',
  `type` enum('ERROR','KENDODIALOGWARNING','ERRORINLINE','ERRORPOPUP','TOOLTIP','KENDODIALOGSUCCESS','INFORMATION','YELLOW','GREEN','RED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Type of message.',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT ' Title, applicable to popups. Null allowed.',
  `message` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Text of the message.',
  `pages` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Pages where the message appears, for programmer information.',
  PRIMARY KEY (`message_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message
-- ----------------------------

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module`  (
  `module_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'A course consists of many modules (continued within units) and modules are collections of concepts contained (sometimes) within concept groups.',
  `module` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Long name of the module.',
  `description` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Optional description for the programmer. Null allowed.',
  `intro` varchar(2000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT 'Introductory language to the module for the end user. This text will appear when the Intro button is clicked.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimecreated` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`module_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of module
-- ----------------------------

-- ----------------------------
-- Table structure for module_concept
-- ----------------------------
DROP TABLE IF EXISTS `module_concept`;
CREATE TABLE `module_concept`  (
  `module_id` int(11) UNSIGNED NOT NULL COMMENT 'This table associates each module with the concept it contains. A module contains many concepts.',
  `concept_id` int(11) UNSIGNED NOT NULL COMMENT 'A concept can be associated with many modules.',
  `order` tinyint(4) UNSIGNED NOT NULL COMMENT 'The order of the concept in the module.',
  `activestatus` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimemodified` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'The date and time last modified.',
  INDEX `idx-fk-normal-module_concept-module_id`(`module_id`) USING BTREE,
  INDEX `idx-fk-normal-module_concept-concept_id`(`concept_id`) USING BTREE,
  CONSTRAINT `fk-module_concept-concept_id` FOREIGN KEY (`concept_id`) REFERENCES `concept` (`concept_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-module_concept-module_id` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of module_concept
-- ----------------------------

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page`  (
  `page_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PK | The page in the site viewable by a role, populated by DB admin. Some pages are viewed by some roles, some by others. A superadmin can view all pages.',
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Filename of the page on the server.',
  `page` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The page name that appears on the tab.',
  `order` tinyint(2) UNSIGNED NOT NULL COMMENT 'The order of the page on the link menu bar.',
  `linkname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Name of the link in the sidebar menu.',
  `iconclass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of the icon class.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description of the page.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`page_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of page
-- ----------------------------
INSERT INTO `page` VALUES ('ADMINUTILITIES', 'adminutilities.module.ts', 'admin utilities', 6, 'www.attotrain.com/adminutilities', '', 'This is accessible only by an admin.', 'A', '2021-05-24 13:26:09');
INSERT INTO `page` VALUES ('COURSEHISTORY', 'coursehistory.module.ts', 'course history', 8, 'www.attotrain.com/coursehistory', '', 'This is accessible only by a student.', 'A', '2021-05-24 13:26:22');
INSERT INTO `page` VALUES ('FORGOTPASS', 'forgotpassword.module.ts', 'forgot password', 1, 'www.attotrain.com/forgotpassword', '', 'This page is a general page accessible by all the roles.', 'A', '2021-05-24 13:25:48');
INSERT INTO `page` VALUES ('INPROGRESS', 'inprogress.module.ts', 'in progress', 7, 'www.attotrain.com/inprogress', '', 'This is accessible only by a student.', 'A', '2021-05-24 13:26:20');
INSERT INTO `page` VALUES ('LOGIN', 'login.module.ts', 'login', 1, 'www.attotrain.com/login', '', 'This page is a general page accessible by all the roles.', 'A', '2021-05-24 13:23:27');
INSERT INTO `page` VALUES ('MANAGECOURSES', 'managecourse.module.ts', 'manage course', 2, 'www.attotrain.com/managecourses', '', 'This is accessible only by an admin.', 'A', '2021-05-24 13:26:03');
INSERT INTO `page` VALUES ('MANAGEQUIZZES', 'managequizzes.module.ts', 'manage quizzes', 3, 'www.attotrain.com/managequizzes', '', 'This is accessible only by an admin.', 'A', '2021-05-24 13:26:04');
INSERT INTO `page` VALUES ('MANAGEUSERS', 'manageusers.module.ts', 'manage users', 4, 'www.attotrain.com/manageusers', '', 'This is accessible only by an admin.', 'A', '2021-05-24 13:26:05');
INSERT INTO `page` VALUES ('MYINFORMATION', 'myinformation.module.ts', 'my information', 10, 'www.attotrain.com/myinformation', '', 'This is accessible only by a student/admin.', 'A', '2021-05-24 13:26:31');
INSERT INTO `page` VALUES ('RESETPASS', 'resetpassword.module.ts', 'reset password', 1, 'www.attotrain.com/resetpassword', '', 'This page is a general page accessible by all the roles.', 'A', '2021-05-24 13:25:50');
INSERT INTO `page` VALUES ('RESOURCES', 'resources.module.ts', 'resources', 9, 'www.attotrain.com/resources', '', 'This is accessible only by a student.', 'A', '2021-05-24 13:26:23');
INSERT INTO `page` VALUES ('STUDENTPROGRESS', 'studentprogress.module.ts', 'student progress', 5, 'www.attotrain.com/studentprogress', '', 'This is accessible only by an admin.', 'A', '2021-05-24 13:26:08');

-- ----------------------------
-- Table structure for quiz
-- ----------------------------
DROP TABLE IF EXISTS `quiz`;
CREATE TABLE `quiz`  (
  `quiz_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | All modules have a quiz. To pass a course, a user must pass every quiz, currently defined by SV-QUIZ-PASSPERCENTAGE at 90.',
  `module_id` int(11) UNSIGNED NOT NULL COMMENT 'The module with which the quiz is associated. Quizzes and modules have a one-to-one relationship; every module has one and only one quiz, and every quiz is associated with one and only one module.',
  `quiz` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Quiz name, usually inherited from module.module when the quiz is created, though later editable by the user.',
  `intromain` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'Introductory quiz text drawn from SV-QUIZ-INTROMAIN as default.',
  `introprevaluation` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'Introductory prevaluation text. SV-QUIZ-INTROPREVALUATION.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive | If I, this association has been removed.',
  `datetimecreated` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Date and time the test was created.',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time the test was last modified.',
  PRIMARY KEY (`quiz_id`) USING BTREE,
  INDEX `idx-fk-normal-quiz-module_id`(`module_id`) USING BTREE,
  CONSTRAINT `fk-quiz-module_id` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of quiz
-- ----------------------------

-- ----------------------------
-- Table structure for quizquestion
-- ----------------------------
DROP TABLE IF EXISTS `quizquestion`;
CREATE TABLE `quizquestion`  (
  `quizquestion_id` int(11) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'Questions for the quiz. This format lends itself to upload as a .csv and possibly .xlsx or .txt file.',
  `quiz_id` int(11) UNSIGNED NOT NULL COMMENT 'The quiz with which the question is associated.',
  `quizquestion` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The question itself.',
  `questiontype` enum('MATCH','MC','TF','FB','CB','SEQ','NA') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NA' COMMENT 'The type of question. MATCH = Matching (answers are paired in linear order, 1 with 2, 3 with 4, etc.) | MC = Multiple Choice (if chosen, only one correct answer allowed that goes into the first column.)| TF = True/False (true answer in the first column) | FB = Fill in the Blank (correct answer in the first column) | SEQ = Sequence (answers have to be given in the order of the columns.) | NA = Not Applicable',
  `feedback` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Given if the question was answered incorrectly. This is optional, feedback will not necessarily be given.',
  `answer1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The correct choice is always stored here for types MC, TF, and FB. Because choices are randomized on presentation, a function needs to be created that matches the student answer with the required answer. If the special string NONE appears in this field, the correct answer is (none of the above), which is always given as a default choice in any event.',
  `answer2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Answer for the B choice, to be randomized. If the SEQ questiontype is chosen, this must follow answer1. If MATCH is chosen, this must be paired with answer1.',
  `answer3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer9` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `answer10` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'See above.',
  `asseturl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The name of the asset that will appear for the question, if any. Null allowed.',
  `assettype` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'Type of asset, like image or pdf. Null allowed.',
  `assetstatus` enum('I','V','S','N') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N' COMMENT 'I = Has Image | V = Has Video | S = Has Sound | N = None (Default). If any value other than N, the asset url field must be populated.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimecreated` datetime(0) NULL DEFAULT NULL,
  `datetimemodified` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'The date and time the last modification was made.',
  PRIMARY KEY (`quizquestion_id`) USING BTREE,
  INDEX `idx-fk-normal-quizquestion-quiz_id`(`quiz_id`) USING BTREE,
  CONSTRAINT `fk-quizquestion-quiz_id` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of quizquestion
-- ----------------------------

-- ----------------------------
-- Table structure for quizuser
-- ----------------------------
DROP TABLE IF EXISTS `quizuser`;
CREATE TABLE `quizuser`  (
  `quizuser_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | Essentially a junction table, this records the score the user received when taking a quiz. It rolls up the values in quizuseranswer.answerstatus and stores not just here at quizuser.score, but also enrollmentprogress.score, and in enrollment.score as an average.',
  `quiz_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The quiz taken by the user.',
  `user_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The user who took the quiz.',
  `last_quizquestion_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The last question answered by the user. This allows bookmarking. Redundant w/ last row of quizuseranswer.quizquestion_id, included here to increase calculation speed.',
  `currentattemptstatus` enum('N','I','P','F') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'N = Not Started | I = In Progress | P = Passed | F = Failed | The status of the current attempt.',
  `answerspossible` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'How many possible answers. If there are 10 questions in the quiz, this is 10.',
  `answerssofar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'How many questions user has answered so far. If they have answered 5 questions of 10, this is 5.',
  `correctsofar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'If of the 5 they answered, 4 are correct, this is 4.',
  `score` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Score the user achieved on their last (successful) attempt. This is only calculated when the quiz is actually finished on an attempt, .answerspossible = .answerssofar.',
  `attempts` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Number of attempts taken by the user. An attempt is 10 out of 10 questions, or 9 out of 9, etc. If after that sequence they have not achieved the target percentage, they need a new attempt.',
  `attemptstatus` enum('N','I','C') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'N = Not attempted | I = In progress | C = Completed.',
  `completionstatus` enum('P','F') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'P = Passed | F = Failed.',
  `datetimestarted` datetime(0) NULL DEFAULT NULL,
  `datetimelastinteraction` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0),
  `datetimefinished` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`quizuser_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of quizuser
-- ----------------------------

-- ----------------------------
-- Table structure for quizuseranswer
-- ----------------------------
DROP TABLE IF EXISTS `quizuseranswer`;
CREATE TABLE `quizuseranswer`  (
  `quizuseranswer_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'This table records the real-time answers the student has given to a quiz question.',
  `quizuser_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | The user taking the quiz.',
  `quizquestion_id` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The target question.',
  `incorrectanswer` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'If quizuseranswer.answerstatus = I (incorrect), we need to track the answer the student gave for feedback puposes (the actual value, not the numerical or alphabetical choice). Null obviously allowed.',
  `correctanswer` varchar(1000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT 'If quizuseranswer.answerstatus = I (incorrect), we need to track the answer the student should have given for feedback purposes (the actual value, not the numerical or alphabetical choice). Null obviously allowed.',
  `answerstatus` enum('C','I','U') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'U' COMMENT 'C = Correct | I = Incorrect | U = Unknown (Default)',
  `datetimestarted` datetime(0) NULL DEFAULT NULL COMMENT 'The time the quiz started.',
  `datetimelastresponse` datetime(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0),
  `datetimefinished` datetime(0) NULL DEFAULT NULL COMMENT 'The time the quiz finished.',
  PRIMARY KEY (`quizuseranswer_id`) USING BTREE,
  INDEX `idx-fk-normal-quizstudentanswer-user_id`(`quizuser_id`) USING BTREE,
  INDEX `idx-fk-normal-quizstudentanswer-quizquestion_id`(`quizquestion_id`) USING BTREE,
  CONSTRAINT `fk-quizstudentanswer-quizquestion_id` FOREIGN KEY (`quizquestion_id`) REFERENCES `quizquestion` (`quizquestion_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-quizuseranswer-quizuser_id` FOREIGN KEY (`quizuser_id`) REFERENCES `quizuser` (`quizuser_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of quizuseranswer
-- ----------------------------

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `role_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The role the user plays.',
  `role` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Examples: Employee, Manager, Admin, Student.',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Description for both the programmer and end user.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('ADMIN', 'Administrator', '', 'A');
INSERT INTO `role` VALUES ('STUDENT', 'Student', '', 'A');

-- ----------------------------
-- Table structure for role_page
-- ----------------------------
DROP TABLE IF EXISTS `role_page`;
CREATE TABLE `role_page`  (
  `role_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | The purpose of this table is to only show certain pages to certain roles, this is the role. One role can see many pages.',
  `page_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | The page assigned to that role. One page can be viewed by many roles.',
  INDEX `idx-fk-normal-role_page-role_id`(`role_id`) USING BTREE,
  INDEX `idx-fk-normal-role_page-page_id`(`page_id`) USING BTREE,
  CONSTRAINT `fk-role_page-page_id` FOREIGN KEY (`page_id`) REFERENCES `page` (`page_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-role_page-role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_page
-- ----------------------------
INSERT INTO `role_page` VALUES ('ADMIN', 'LOGIN');
INSERT INTO `role_page` VALUES ('ADMIN', 'FORGOTPASS');
INSERT INTO `role_page` VALUES ('ADMIN', 'RESETPASS');
INSERT INTO `role_page` VALUES ('ADMIN', 'MANAGECOURSES');
INSERT INTO `role_page` VALUES ('ADMIN', 'MANAGEQUIZZES');
INSERT INTO `role_page` VALUES ('ADMIN', 'MANAGEUSERS');
INSERT INTO `role_page` VALUES ('ADMIN', 'STUDENTPROGRESS');
INSERT INTO `role_page` VALUES ('ADMIN', 'ADMINUTILITIES');
INSERT INTO `role_page` VALUES ('STUDENT', 'INPROGRESS');
INSERT INTO `role_page` VALUES ('STUDENT', 'COURSEHISTORY');
INSERT INTO `role_page` VALUES ('STUDENT', 'RESOURCES');
INSERT INTO `role_page` VALUES ('STUDENT', 'MYINFORMATION');
INSERT INTO `role_page` VALUES ('ADMIN', 'MYINFORMATION');

-- ----------------------------
-- Table structure for sitevariable
-- ----------------------------
DROP TABLE IF EXISTS `sitevariable`;
CREATE TABLE `sitevariable`  (
  `SV-SETTINGS-SESSIONTIME` tinyint(4) UNSIGNED NULL DEFAULT NULL COMMENT 'Time in minutes a session lasts.',
  `SV-SETTINGS-STAGEVIDEOWIDTH` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The width of the video displayed.',
  `SV-SETTINGS-STAGEVIDEOHEIGHT` int(11) UNSIGNED NULL DEFAULT NULL COMMENT 'The height of the video displayed.',
  `SV-SETTINGS-MAXVIDEOSIZE` tinyint(4) UNSIGNED NULL DEFAULT NULL COMMENT 'The max size of the video to be uploaded.',
  `SV-ALERT-AUTODISMISS-MAX` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `SV-QUIZ-PASSPERCENTAGE` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `SV-QUIZ-INTROMAIN` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `SV-QUIZ-INTROPREVALUATION` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sitevariable
-- ----------------------------

-- ----------------------------
-- Table structure for state
-- ----------------------------
DROP TABLE IF EXISTS `state`;
CREATE TABLE `state`  (
  `state_id` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PK | This table holds states in the United States; a two character state id, like GA or FL.',
  `state` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The state, e.g. Georgia, Florida, etc.',
  PRIMARY KEY (`state_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of state
-- ----------------------------

-- ----------------------------
-- Table structure for unit
-- ----------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit`  (
  `unit_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK | A course contains units, a unit contains modules.',
  `unit` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Name of the unit.',
  `activestatus` enum('A','I') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datetimemodified` timestamp(0) NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'Date and time of last update.',
  PRIMARY KEY (`unit_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of unit
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK for user table. Holds user information.',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The user\'s email.',
  `namefirst` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The user\'s first name.',
  `namelast` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The user\'s last name.',
  `password` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The user\'s login password, hashed.',
  `phonemobile` char(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The users\' mobile phone number.',
  `phoneother` char(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The user\'s alternate phone number.',
  `skype` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The Skype ID of the user.',
  `address1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'First line of the user\'s address.',
  `address2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Second line of the user\'s address.',
  `zip` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The user\'s zip code.',
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The city the user is based in.',
  `state` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The state the user is based in.',
  `hiredate` datetime(0) NULL DEFAULT NULL COMMENT 'Date user was hired.',
  `terminationdate` datetime(0) NULL DEFAULT NULL COMMENT 'Date user was terminated or otherwise left the company.',
  `employeeID` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'The user\'s employee ID. Null allowed.',
  `activestatus` enum('A','I','') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'A' COMMENT 'A = Active (Default) | I = Inactive',
  `datagrid` tinyint(4) UNSIGNED NULL DEFAULT 10 COMMENT 'How many rows to show as a default in the datagrid for page size, for usability considerations.',
  `datecreated` datetime(0) NOT NULL COMMENT 'The date the user\'s information was created.',
  `datemodified` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT 'The date the user\'s information was last modified',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `idx-unique-email`(`email`) USING BTREE COMMENT 'Just one email'
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'student@x.com', 'Student', 'User', 'x', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', 10, '0000-00-00 00:00:00', '2021-05-24 06:28:50');
INSERT INTO `user` VALUES (2, 'admin@x.com', 'Admin', 'User', 'xxxxxx', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'A', 10, '0000-00-00 00:00:00', '2021-05-27 07:49:43');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` int(11) UNSIGNED NOT NULL COMMENT 'FK | user | one user can play many roles in the system.',
  `role_id` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'FK | role | one role can be played by many users.',
  INDEX `idx-fk-normal-user_role-user_id`(`user_id`) USING BTREE,
  INDEX `fk-user_role-role_id`(`role_id`) USING BTREE,
  CONSTRAINT `fk-user_role-role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk-user_role-user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES (1, 'STUDENT');
INSERT INTO `user_role` VALUES (2, 'ADMIN');

-- ----------------------------
-- Table structure for zip
-- ----------------------------
DROP TABLE IF EXISTS `zip`;
CREATE TABLE `zip`  (
  `zip_id` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PK for zip table. US zip codes.',
  `city` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The city the zip code is based in.',
  `state` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The state the zip code is based in.',
  `county` varchar(35) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The county the zip code is based in.',
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USA' COMMENT 'The country the zip code is based in.',
  `latitude` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The latitude of the zip code.',
  `longitude` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'The longitude of the zip code.',
  PRIMARY KEY (`zip_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of zip
-- ----------------------------

-- ----------------------------
-- Triggers structure for table zip
-- ----------------------------
DROP TRIGGER IF EXISTS `preventInsert`;
delimiter ;;
CREATE TRIGGER `preventInsert` BEFORE INSERT ON `zip` FOR EACH ROW BEGIN
    SIGNAL SQLSTATE VALUE '99999'
      SET MESSAGE_TEXT = 'You cannot insert rows in to this table.';
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table zip
-- ----------------------------
DROP TRIGGER IF EXISTS `preventUpdate`;
delimiter ;;
CREATE TRIGGER `preventUpdate` BEFORE UPDATE ON `zip` FOR EACH ROW BEGIN
    SIGNAL SQLSTATE VALUE '99997'
      SET MESSAGE_TEXT = 'You cannot edit rows in this table.';
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table zip
-- ----------------------------
DROP TRIGGER IF EXISTS `preventDelete`;
delimiter ;;
CREATE TRIGGER `preventDelete` BEFORE DELETE ON `zip` FOR EACH ROW BEGIN
    SIGNAL SQLSTATE VALUE '99998'
      SET MESSAGE_TEXT = 'You cannot delete rows in this table.';
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
