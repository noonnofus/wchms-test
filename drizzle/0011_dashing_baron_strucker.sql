CREATE TABLE `scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`time` int NOT NULL,
	`participant_id` int NOT NULL,
	`instructor_id` int,
	`session_id` int NOT NULL,
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_participant_id_participants_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_instructor_id_users_id_fk` FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scores` ADD CONSTRAINT `scores_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON DELETE no action ON UPDATE no action;