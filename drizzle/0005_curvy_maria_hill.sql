ALTER TABLE `staff_members` MODIFY COLUMN `address` varchar(255);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `county` varchar(100);--> statement-breakpoint
ALTER TABLE `staff_members` ADD `postcode` varchar(10);--> statement-breakpoint
ALTER TABLE `staff_members` DROP COLUMN `state`;