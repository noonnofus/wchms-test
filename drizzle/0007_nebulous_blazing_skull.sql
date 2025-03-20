ALTER TABLE `upload_media` RENAME COLUMN `file_data` TO `file_key`;--> statement-breakpoint
ALTER TABLE `upload_media` RENAME COLUMN `origin_id` TO `owner_id`;--> statement-breakpoint
ALTER TABLE `courses` DROP FOREIGN KEY `courses_upload_id_upload_media_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_materials` DROP FOREIGN KEY `course_materials_upload_id_upload_media_id_fk`;
--> statement-breakpoint
ALTER TABLE `rooms` MODIFY COLUMN `medium` enum('online','in-person') NOT NULL;--> statement-breakpoint
ALTER TABLE `course_materials` ADD `url` varchar(2083);--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_upload_id_upload_media_id_fk` FOREIGN KEY (`upload_id`) REFERENCES `upload_media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_upload_id_upload_media_id_fk` FOREIGN KEY (`upload_id`) REFERENCES `upload_media`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `upload_media` ADD CONSTRAINT `upload_media_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;