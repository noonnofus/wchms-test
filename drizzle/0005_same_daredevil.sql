CREATE TABLE `participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255),
	`date_of_birth` date NOT NULL,
	`gender` enum('male','female','other'),
	CONSTRAINT `participants_id` PRIMARY KEY(`id`),
	CONSTRAINT `participants_email_unique` UNIQUE(`email`)
);
