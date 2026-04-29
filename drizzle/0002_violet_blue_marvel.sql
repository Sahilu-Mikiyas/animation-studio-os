CREATE TABLE `portfolio_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portfolio_file_id` int NOT NULL,
	`user_id` int NOT NULL,
	`overall_score` tinyint,
	`fluidity_score` tinyint,
	`timing_score` tinyint,
	`weight_score` tinyint,
	`anticipation_score` tinyint,
	`spacing_score` tinyint,
	`appeal_score` tinyint,
	`tags` json,
	`strengths` longtext,
	`areas_for_improvement` longtext,
	`detailed_feedback` longtext,
	`percentile_rank` tinyint,
	`comparison_notes` text,
	`model_version` varchar(50),
	`analysis_timestamp` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_url` varchar(512) NOT NULL,
	`file_key` varchar(255) NOT NULL,
	`file_type` varchar(50),
	`file_size` int,
	`title` varchar(255),
	`description` longtext,
	`status` enum('uploaded','analyzing','analyzed','failed') DEFAULT 'uploaded',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`average_overall_score` decimal(5,2),
	`average_fluidity` decimal(5,2),
	`average_timing` decimal(5,2),
	`average_weight` decimal(5,2),
	`top_strengths` json,
	`common_improvements` json,
	`quality_trend` json,
	`files_analyzed` int DEFAULT 0,
	`last_analyzed` datetime,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_insights_id` PRIMARY KEY(`id`)
);
