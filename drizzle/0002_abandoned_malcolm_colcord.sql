ALTER TABLE `staff_members` ADD `status` enum('pending','approved','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `staff_members` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `experience` text;