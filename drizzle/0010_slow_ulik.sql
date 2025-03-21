ALTER TABLE `scores` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `scores` DROP COLUMN `date`;--> statement-breakpoint
ALTER TABLE `scores` DROP COLUMN `note`;