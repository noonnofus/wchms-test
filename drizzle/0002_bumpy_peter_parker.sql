ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_room_id_rooms_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `room_id`;