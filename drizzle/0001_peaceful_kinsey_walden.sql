CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`tasks_completed` int DEFAULT 0,
	`tasks_total` int DEFAULT 0,
	`average_score` decimal(5,2) DEFAULT '0',
	`skill_growth_trend` json,
	`total_earned` decimal(12,2) DEFAULT '0',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`age` tinyint,
	`country` varchar(100),
	`portfolio_links` json,
	`resume_url` varchar(512),
	`software_proficiency` json,
	`discipline_interest` json,
	`motivation_statement` longtext,
	`skill_level` enum('beginner','intermediate','advanced','professional'),
	`status` enum('submitted','under_review','shortlisted','rejected','hired') DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessment_id` int NOT NULL,
	`user_id` int NOT NULL,
	`video_url` varchar(512),
	`project_file_url` varchar(512),
	`file_type` varchar(50),
	`version` int DEFAULT 1,
	`score` tinyint,
	`feedback` longtext,
	`status` enum('submitted','under_review','scored','revision_requested') DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('practical','written','hybrid') DEFAULT 'hybrid',
	`title` varchar(255),
	`description` longtext,
	`timing_accuracy` tinyint,
	`motion_fluidity` tinyint,
	`creativity` tinyint,
	`technical_execution` tinyint,
	`file_cleanliness` tinyint,
	`score_total` tinyint,
	`level_assigned` tinyint,
	`recommendation` enum('reject','train','hire_trainee','hire'),
	`llm_feedback` longtext,
	`human_feedback` longtext,
	`status` enum('pending','in_progress','completed','reviewed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon_url` varchar(512),
	`type` enum('speed','detail','consistency','creativity','technical') DEFAULT 'technical',
	`xp_requirement` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`salary` decimal(10,2),
	`role` varchar(100),
	`level` tinyint,
	`document_url` varchar(512),
	`signed_status` enum('pending','signed','rejected') DEFAULT 'pending',
	`signed_date` datetime,
	`version` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`category` varchar(100),
	`content_url` varchar(512),
	`lesson_cards` json,
	`difficulty_level` tinyint,
	`estimated_duration` int,
	`status` enum('draft','published','archived') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learning_modules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext,
	`type` enum('application','task','assessment','payment','system') DEFAULT 'system',
	`link_url` varchar(512),
	`read` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`type` enum('salary','bonus','withdrawal') DEFAULT 'salary',
	`method` enum('bank','mobile_money','crypto'),
	`status` enum('pending','processed','failed','cancelled') DEFAULT 'pending',
	`reference_id` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `task_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`task_id` int NOT NULL,
	`user_id` int NOT NULL,
	`file_url` varchar(512),
	`notes` longtext,
	`version` int DEFAULT 1,
	`reviewer_id` int,
	`score` tinyint,
	`feedback` longtext,
	`revision_requested` boolean DEFAULT false,
	`status` enum('submitted','under_review','approved','revision_requested') DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `task_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`type` enum('learning','production') DEFAULT 'learning',
	`assigned_to` int,
	`assigned_by` int,
	`deadline` datetime,
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`difficulty_rating` tinyint,
	`status` enum('pending','in_progress','submitted','under_review','completed','rejected') DEFAULT 'pending',
	`supervisor_id` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`badge_id` int NOT NULL,
	`earned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`module_id` int NOT NULL,
	`progress_percentage` tinyint DEFAULT 0,
	`completed` boolean DEFAULT false,
	`checkpoints_completed` json,
	`started_at` datetime,
	`completed_at` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('applicant','artist','admin') NOT NULL DEFAULT 'applicant';--> statement-breakpoint
ALTER TABLE `users` ADD `level` tinyint DEFAULT 1;--> statement-breakpoint
ALTER TABLE `users` ADD `xp` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `salary` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('pending','active','inactive','rejected') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `users` ADD `portfolio_links` json;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar_url` varchar(512);--> statement-breakpoint
ALTER TABLE `users` ADD `bank_account` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `payment_method` enum('bank','mobile_money','crypto');