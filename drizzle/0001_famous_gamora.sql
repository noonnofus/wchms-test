ALTER TABLE `users` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `gender` enum('male','female','other');--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('participant','admin','staff') DEFAULT 'participant';--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `birth_date`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `building`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `street`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `province`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `postal_code`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `timezone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `lang`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `course_id`;