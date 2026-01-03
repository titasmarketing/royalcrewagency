ALTER TABLE `events` ADD `paymentMethod` enum('stripe','bank_transfer','cash');--> statement-breakpoint
ALTER TABLE `events` ADD `paymentLink` text;--> statement-breakpoint
ALTER TABLE `events` ADD `bankAccountDetails` text;