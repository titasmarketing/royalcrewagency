CREATE TABLE `gallery_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(500) NOT NULL,
	`category` enum('weddings','corporate_events','private_parties','conferences','gala_dinners','other') NOT NULL DEFAULT 'other',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_photos_id` PRIMARY KEY(`id`)
);
