CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `account_provider_account_unique` ON `account` (`providerId`,`accountId`);--> statement-breakpoint
CREATE TABLE `application` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`audience` text NOT NULL,
	`clientId` text NOT NULL,
	`clientSecretHash` text,
	`type` text DEFAULT 'web' NOT NULL,
	`description` text,
	`homepageUrl` text,
	`logoUrl` text,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `application_slug_unique` ON `application` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `application_audience_unique` ON `application` (`audience`);--> statement-breakpoint
CREATE UNIQUE INDEX `application_clientId_unique` ON `application` (`clientId`);--> statement-breakpoint
CREATE TABLE `applicationOrigin` (
	`id` text PRIMARY KEY NOT NULL,
	`applicationId` text NOT NULL,
	`origin` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `applicationOrigin_applicationId_idx` ON `applicationOrigin` (`applicationId`);--> statement-breakpoint
CREATE UNIQUE INDEX `applicationOrigin_application_origin_unique` ON `applicationOrigin` (`applicationId`,`origin`);--> statement-breakpoint
CREATE TABLE `applicationRedirectUri` (
	`id` text PRIMARY KEY NOT NULL,
	`applicationId` text NOT NULL,
	`uri` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `applicationRedirectUri_applicationId_idx` ON `applicationRedirectUri` (`applicationId`);--> statement-breakpoint
CREATE UNIQUE INDEX `applicationRedirectUri_application_uri_unique` ON `applicationRedirectUri` (`applicationId`,`uri`);--> statement-breakpoint
CREATE TABLE `applicationScope` (
	`id` text PRIMARY KEY NOT NULL,
	`applicationId` text NOT NULL,
	`scope` text NOT NULL,
	`description` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `applicationScope_applicationId_idx` ON `applicationScope` (`applicationId`);--> statement-breakpoint
CREATE UNIQUE INDEX `applicationScope_application_scope_unique` ON `applicationScope` (`applicationId`,`scope`);--> statement-breakpoint
CREATE TABLE `applicationUser` (
	`id` text PRIMARY KEY NOT NULL,
	`applicationId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`scopes` text DEFAULT '[]' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`lastLoginAt` integer,
	FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `applicationUser_applicationId_idx` ON `applicationUser` (`applicationId`);--> statement-breakpoint
CREATE INDEX `applicationUser_userId_idx` ON `applicationUser` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `applicationUser_application_user_unique` ON `applicationUser` (`applicationId`,`userId`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	`applicationId` text,
	`audience` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `session_applicationId_idx` ON `session` (`applicationId`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);