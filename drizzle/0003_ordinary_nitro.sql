CREATE TABLE `course_join_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`course_id` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`requested_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_join_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_materials` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('Simple Arithmetic','Reading Aloud','Physical Exercise') NOT NULL,
	`difficulty` enum('Basic','Intermediate') NOT NULL,
	`description` text,
	`upload_id` int,
	`course_id` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `course_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `assignments`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `gender` enum('Male','Female','Other');--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('Admin','Staff') NOT NULL DEFAULT 'Staff';--> statement-breakpoint
ALTER TABLE `course_join_requests` ADD CONSTRAINT `course_join_requests_user_id_participants_id_fk` FOREIGN KEY (`user_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_join_requests` ADD CONSTRAINT `course_join_requests_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_upload_id_upload_media_id_fk` FOREIGN KEY (`upload_id`) REFERENCES `upload_media`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;