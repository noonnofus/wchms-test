CREATE TABLE `announcements` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` varchar(255) NOT NULL,
	`start` date,
	`end` date,
	`lang` varchar(255),
	`kind` varchar(255) NOT NULL,
	`status` enum('draft','published','archived') NOT NULL,
	`target` enum('all_users','specific_user') NOT NULL,
	`sort_order` int DEFAULT 0,
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`kind` enum('homework','report','project') NOT NULL,
	`description` text,
	`internal_note` text,
	`upload_id` varchar(255),
	`course_id` varchar(255) NOT NULL,
	`is_aggregated` boolean DEFAULT false,
	`sort_order` int NOT NULL,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255),
	`start` timestamp NOT NULL,
	`end` timestamp,
	`deadline` timestamp,
	`kind` varchar(100) NOT NULL,
	`status` varchar(100) NOT NULL,
	`lang` varchar(10) NOT NULL,
	`timezone` varchar(50) DEFAULT 'America/Vancouver',
	`category_id` int,
	`upload_id` int,
	`room_id` int,
	`forum_id` int,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_participants` (
	`id` int NOT NULL,
	`user_id` int,
	`course_id` int NOT NULL,
	`status` varchar(50),
	`subscription_id` int,
	CONSTRAINT `course_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_schedules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`course_id` int NOT NULL,
	`instructor_id` int,
	`day_of_week` varchar(20) NOT NULL,
	`start` time NOT NULL,
	`end` time NOT NULL,
	`internal_note` varchar(255),
	`kind` enum('lecture','seminar','workshop') NOT NULL,
	`sort_order` int,
	CONSTRAINT `course_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forums` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`kind` enum('discussion','announcement','question') NOT NULL,
	`status` enum('active','inactive','archived') NOT NULL,
	`owner_id` int,
	`sort_order` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`status` enum('draft','published','notified') NOT NULL,
	`owner_id` int,
	`recipient_id` int,
	`forum_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `options` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`kind` varchar(255) NOT NULL,
	`group` enum('general','advanced'),
	`name` varchar(255) NOT NULL,
	`data` text NOT NULL,
	CONSTRAINT `options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`amount` float NOT NULL,
	`taxes` float DEFAULT 0,
	`description` text,
	`metadata` text,
	`kind` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`pricing_id` varchar(255),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(1024) NOT NULL,
	`answer` varchar(1024),
	`description` varchar(2048),
	`internal_note` varchar(1024),
	`score` float NOT NULL,
	`kind` enum('normal','advanced') DEFAULT 'normal',
	`status` enum('active','inactive','draft') NOT NULL,
	`group_id` int NOT NULL,
	`sort_order` int,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_groups` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`internal_note` text,
	`status` varchar(50) NOT NULL,
	`sort_order` int,
	CONSTRAINT `quiz_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_scores` (
	`id` varchar(255) NOT NULL,
	`score` float NOT NULL,
	`start` datetime,
	`end` datetime,
	`summary_id` varchar(255) NOT NULL,
	`quiz_group_id` varchar(255) NOT NULL,
	`quiz_id` varchar(255) NOT NULL,
	CONSTRAINT `quiz_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_summaries` (
	`id` varchar(36) NOT NULL,
	`date_taken` date NOT NULL,
	`comment` text,
	`total_score` float NOT NULL,
	`max_score` float NOT NULL,
	`internal_note` text,
	`grade` varchar(10) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`instructor_id` varchar(36) NOT NULL,
	`session_id` varchar(36),
	CONSTRAINT `quiz_summaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`internal_note` varchar(255),
	`url` varchar(255),
	`capacity` int,
	`medium` enum('online','offline') NOT NULL,
	`status` enum('available','unavailable') NOT NULL,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `score_books` (
	`score_book_id` int NOT NULL,
	`time` timestamp NOT NULL,
	`str_time` varchar(255),
	`comment` varchar(255),
	`material` varchar(255),
	`internal_note` varchar(255),
	`method` varchar(100) NOT NULL,
	`user_id` int NOT NULL,
	`instructor_id` int,
	`session_id` int NOT NULL,
	CONSTRAINT `score_books_score_book_id` PRIMARY KEY(`score_book_id`)
);
--> statement-breakpoint
CREATE TABLE `session_availabilities` (
	`session_availability_id` int NOT NULL,
	`start` timestamp NOT NULL,
	`duration` varchar(50) NOT NULL,
	`status` varchar(100) NOT NULL,
	`course_id` int NOT NULL,
	`end` timestamp,
	CONSTRAINT `session_availabilities_session_availability_id` PRIMARY KEY(`session_availability_id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pass_kind` enum('unlimited','single') NOT NULL,
	`price` float,
	`tax_pst` float,
	`tax_gst` float,
	`expiry_date` date,
	`status` enum('pending','active','cancelled') NOT NULL,
	`payment` varchar(255) NOT NULL,
	`is_paid` boolean NOT NULL,
	`customer_note` varchar(255),
	`internal_note` varchar(255),
	`user_id` varchar(255) NOT NULL,
	`course_id` varchar(255),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`birth_date` date,
	`gender` enum('male','female','other') NOT NULL,
	`building` varchar(255),
	`street` varchar(255),
	`city` varchar(255) NOT NULL,
	`province` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`postal_code` varchar(255),
	`timezone` varchar(255) DEFAULT 'America/Vancouver',
	`lang` varchar(255) DEFAULT 'en',
	`role` enum('client','staff','admin') DEFAULT 'client',
	`status` enum('active','inactive') DEFAULT 'active',
	`course_id` varchar(255),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
