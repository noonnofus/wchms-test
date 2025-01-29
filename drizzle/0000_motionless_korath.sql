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
