CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255),
	`document` varchar(50),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(20),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`type` enum('contract','service_order','invoice') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500),
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_inventory_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`itemId` int NOT NULL,
	`quantityRequested` int NOT NULL,
	`quantityUsed` int,
	`status` enum('pending','allocated','used','returned') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_inventory_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_staff_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`staffId` int NOT NULL,
	`role` varchar(100),
	`status` enum('invited','accepted','declined','confirmed') NOT NULL DEFAULT 'invited',
	`payment` decimal(10,2),
	`paymentStatus` enum('pending','paid','bonus') NOT NULL DEFAULT 'pending',
	`invitedAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `event_staff_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`status` enum('pending','team_dispatched','team_on_location','service_started','service_completed') NOT NULL DEFAULT 'pending',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_tracking_id` PRIMARY KEY(`id`),
	CONSTRAINT `event_tracking_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`serviceId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('quote','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'quote',
	`eventDate` timestamp NOT NULL,
	`startTime` varchar(10),
	`endTime` varchar(10),
	`location` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`totalPrice` decimal(10,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`unit` varchar(50),
	`currentStock` int NOT NULL DEFAULT 0,
	`minStock` int NOT NULL DEFAULT 0,
	`unitCost` decimal(10,2),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`data` json,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int,
	`clientId` int,
	`staffId` int,
	`type` enum('client_payment','staff_payment') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`dueDate` timestamp,
	`paidAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_inventory_kits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`itemId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_inventory_kits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`basePrice` decimal(10,2),
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`coverImage` text,
	`galleryImages` json,
	`seoTitle` varchar(255),
	`seoDescription` varchar(500),
	`seoKeywords` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `staff_availability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`date` timestamp NOT NULL,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_availability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialties` json,
	`hourlyRate` decimal(10,2),
	`rating` decimal(3,2) DEFAULT '0.00',
	`totalEvents` int NOT NULL DEFAULT 0,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`isActive` boolean NOT NULL DEFAULT true,
	`profileImage` text,
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`eventId` int NOT NULL,
	`clientId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `staff_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','staff','client') NOT NULL DEFAULT 'client';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);ALTER TABLE `staff_members` ADD `status` enum('pending','approved','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `staff_members` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `experience` text;ALTER TABLE `staff_members` DROP COLUMN `cpf`;CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_section_unique` UNIQUE(`section`)
);
