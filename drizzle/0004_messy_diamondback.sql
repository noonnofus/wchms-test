ALTER TABLE `course_join_requests` RENAME COLUMN `user_id` TO `participant_id`;--> statement-breakpoint
ALTER TABLE `course_join_requests` DROP FOREIGN KEY `course_join_requests_user_id_participants_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_join_requests` ADD CONSTRAINT `course_join_requests_participant_id_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;