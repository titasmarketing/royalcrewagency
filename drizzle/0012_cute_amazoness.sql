CREATE TABLE `staff_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`eventId` int,
	`senderId` int NOT NULL,
	`senderRole` enum('staff','admin') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staff_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`photoUrl` text NOT NULL,
	`photoKey` text NOT NULL,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staff_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `event_staff_assignments` ADD `checkInTime` timestamp;--> statement-breakpoint
ALTER TABLE `event_staff_assignments` ADD `checkOutTime` timestamp;--> statement-breakpoint
ALTER TABLE `event_staff_assignments` ADD `checkInLocation` text;--> statement-breakpoint
ALTER TABLE `event_staff_assignments` ADD `checkOutLocation` text;