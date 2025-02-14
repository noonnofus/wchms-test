ALTER TABLE `courses` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `course_participants` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `rooms` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_participants` ADD CONSTRAINT `course_participants_user_id_participants_id_fk` FOREIGN KEY (`user_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_participants` ADD CONSTRAINT `course_participants_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `deadline`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `timezone`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `category_id`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `upload_id`;--> statement-breakpoint
ALTER TABLE `courses` DROP COLUMN `forum_id`;