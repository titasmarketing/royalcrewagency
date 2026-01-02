CREATE TABLE `event_menu_selections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`menuItemId` int NOT NULL,
	`quantity` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_menu_selections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` enum('Starters','Main Course','Desserts','Beverages','Other') NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`ingredients` text,
	`imageUrl` varchar(500),
	`imageKey` varchar(500),
	`displayOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
