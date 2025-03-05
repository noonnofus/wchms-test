ALTER TABLE `course_participants` DROP FOREIGN KEY `course_participants_user_id_participants_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_participants` DROP FOREIGN KEY `course_participants_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_join_requests` DROP FOREIGN KEY `course_join_requests_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_materials` DROP FOREIGN KEY `course_materials_course_id_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `course_participants` ADD CONSTRAINT `course_participants_user_id_participants_id_fk` FOREIGN KEY (`user_id`) REFERENCES `participants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_participants` ADD CONSTRAINT `course_participants_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_join_requests` ADD CONSTRAINT `course_join_requests_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;