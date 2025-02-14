ALTER TABLE `courses` MODIFY COLUMN `upload_id` bigint;--> statement-breakpoint
ALTER TABLE `upload_media` ADD `file_name` varchar(255) NOT NULL;