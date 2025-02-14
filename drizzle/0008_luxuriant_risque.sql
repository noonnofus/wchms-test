CREATE TABLE `upload_media` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`file_type` varchar(50) NOT NULL,
	`file_data` int NOT NULL,
	`media_origin` varchar(50) NOT NULL,
	`origin_id` int NOT NULL,
	`uploaded_at` timestamp DEFAULT (now()),
	CONSTRAINT `upload_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `courses` ADD `upload_id` int;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_upload_id_upload_media_id_fk` FOREIGN KEY (`upload_id`) REFERENCES `upload_media`(`id`) ON DELETE no action ON UPDATE no action;