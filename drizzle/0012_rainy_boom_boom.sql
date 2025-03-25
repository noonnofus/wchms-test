DROP TABLE `announcements`;--> statement-breakpoint
DROP TABLE `course_schedules`;--> statement-breakpoint
DROP TABLE `forums`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
DROP TABLE `options`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
DROP TABLE `quizzes`;--> statement-breakpoint
DROP TABLE `quiz_groups`;--> statement-breakpoint
DROP TABLE `quiz_scores`;--> statement-breakpoint
DROP TABLE `quiz_summaries`;--> statement-breakpoint
DROP TABLE `score_books`;--> statement-breakpoint
DROP TABLE `session_availabilities`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `status` enum('Available','Completed') NOT NULL;