CREATE TABLE `application_events` (
	`id` text PRIMARY KEY NOT NULL,
	`application_id` text NOT NULL,
	`actor_id` text,
	`type` text NOT NULL,
	`body` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `application_events_app` ON `application_events` (`application_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `content_views` (
	`item_id` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `content`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `applications` ADD `answers` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `knockout` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `rating` integer;--> statement-breakpoint
ALTER TABLE `applications` ADD `match_score` integer;--> statement-breakpoint
CREATE INDEX `memberships_org_status` ON `memberships` (`organization_id`,`status`);