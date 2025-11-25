CREATE TABLE `accessorials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`default_rate` int,
	`rate_type` varchar(20),
	`applies_to_types` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessorials_id` PRIMARY KEY(`id`),
	CONSTRAINT `accessorials_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `ai_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`session_id` varchar(50),
	`interaction_type` varchar(50),
	`input_data` text,
	`output_data` text,
	`model_used` varchar(50),
	`tokens_used` int,
	`response_time_ms` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `carriers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`company_id` int,
	`name` varchar(255) NOT NULL,
	`mc_number` varchar(20),
	`dot_number` varchar(20),
	`scac_code` varchar(4),
	`carrier_type` varchar(100),
	`service_areas` text,
	`equipment_types` varchar(255),
	`insurance_info` text,
	`rating` int DEFAULT 0,
	`api_enabled` tinyint DEFAULT 0,
	`api_config` text,
	`status` varchar(20) DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `carriers_id` PRIMARY KEY(`id`),
	CONSTRAINT `carriers_mc_number_unique` UNIQUE(`mc_number`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('shipper','consignee','broker','carrier') NOT NULL,
	`mc_number` varchar(20),
	`dot_number` varchar(20),
	`tax_id` varchar(20),
	`credit_limit` int DEFAULT 0,
	`payment_terms` int DEFAULT 30,
	`address` text,
	`contacts` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dispatches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dispatch_number` varchar(20) NOT NULL,
	`quote_id` int,
	`customer_id` int,
	`carrier_id` int,
	`driver_id` int,
	`container_number` varchar(20),
	`seal_number` varchar(20),
	`bill_of_lading` varchar(30),
	`booking_number` varchar(30),
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`stops` text,
	`pickup_appointment` varchar(30),
	`delivery_appointment` varchar(30),
	`actual_pickup` varchar(30),
	`actual_delivery` varchar(30),
	`last_free_day` varchar(10),
	`cutoff_date` varchar(30),
	`carrier_rate` int,
	`customer_rate` int,
	`accessorials` text,
	`total_cost` int,
	`total_revenue` int,
	`gross_profit` int,
	`status` varchar(30) DEFAULT 'pending',
	`current_location` text,
	`eta` varchar(30),
	`status_history` text,
	`documents` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dispatches_id` PRIMARY KEY(`id`),
	CONSTRAINT `dispatches_dispatch_number_unique` UNIQUE(`dispatch_number`)
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`carrier_id` int,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(255),
	`license_number` varchar(50),
	`license_expiry` varchar(10),
	`twic_number` varchar(20),
	`twic_expiry` varchar(10),
	`equipment_id` int,
	`current_location` text,
	`status` varchar(20) DEFAULT 'available',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drivers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote_number` varchar(20) NOT NULL,
	`customer_id` int,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`container_info` text,
	`service_type` varchar(50),
	`pickup_date` varchar(10),
	`delivery_date` varchar(10),
	`rates` text,
	`total_rate` int,
	`margin_percent` int,
	`carrier_quotes` text,
	`selected_carrier_id` int,
	`ai_recommendation` text,
	`status` varchar(30) DEFAULT 'draft',
	`valid_until` varchar(10),
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotes_quote_number_unique` UNIQUE(`quote_number`)
);
--> statement-breakpoint
CREATE TABLE `rate_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`carrier_id` int,
	`origin_zone` varchar(50),
	`destination_zone` varchar(50),
	`container_size` varchar(10),
	`base_rate` int,
	`fuel_surcharge_percent` int,
	`chassis_fee` int,
	`port_congestion_fee` int,
	`effective_date` varchar(10),
	`expiry_date` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rate_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ai_logs` ADD CONSTRAINT `ai_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `carriers` ADD CONSTRAINT `carriers_company_id_companies_id_fk` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dispatches` ADD CONSTRAINT `dispatches_quote_id_quotes_id_fk` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dispatches` ADD CONSTRAINT `dispatches_customer_id_companies_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dispatches` ADD CONSTRAINT `dispatches_carrier_id_carriers_id_fk` FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dispatches` ADD CONSTRAINT `dispatches_driver_id_drivers_id_fk` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `drivers` ADD CONSTRAINT `drivers_carrier_id_carriers_id_fk` FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_customer_id_companies_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_selected_carrier_id_carriers_id_fk` FOREIGN KEY (`selected_carrier_id`) REFERENCES `carriers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rate_cards` ADD CONSTRAINT `rate_cards_carrier_id_carriers_id_fk` FOREIGN KEY (`carrier_id`) REFERENCES `carriers`(`id`) ON DELETE no action ON UPDATE no action;