ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_participants_id_fk` FOREIGN KEY (`user_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE no action;