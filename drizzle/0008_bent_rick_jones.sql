CREATE TABLE `event_partner_companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`partnerCompanyId` int NOT NULL,
	`role` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_partner_companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`serviceId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`price` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_services_id` PRIMARY KEY(`id`)
);
