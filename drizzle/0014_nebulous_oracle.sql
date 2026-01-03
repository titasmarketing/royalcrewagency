CREATE TABLE `event_menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`menuItemId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_menu_items_id` PRIMARY KEY(`id`)
);
