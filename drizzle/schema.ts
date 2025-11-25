import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Companies/Clients Table
export const companies = mysqlTable('companies', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['shipper', 'consignee', 'broker', 'carrier']).notNull(),
  mcNumber: varchar('mc_number', { length: 20 }),
  dotNumber: varchar('dot_number', { length: 20 }),
  taxId: varchar('tax_id', { length: 20 }),
  creditLimit: int('credit_limit').default(0),
  paymentTerms: int('payment_terms').default(30),
  address: text('address'), // JSON stored as text
  contacts: text('contacts'), // JSON stored as text
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// Carriers Table
export const carriers = mysqlTable('carriers', {
  id: int('id').autoincrement().primaryKey(),
  companyId: int('company_id').references(() => companies.id),
  name: varchar('name', { length: 255 }).notNull(),
  mcNumber: varchar('mc_number', { length: 20 }).unique(),
  dotNumber: varchar('dot_number', { length: 20 }),
  scacCode: varchar('scac_code', { length: 4 }),
  carrierType: varchar('carrier_type', { length: 100 }), // JSON array as text
  serviceAreas: text('service_areas'), // JSON
  equipmentTypes: varchar('equipment_types', { length: 255 }), // JSON array
  insuranceInfo: text('insurance_info'), // JSON
  rating: int('rating').default(0), // 0-100 scale
  apiEnabled: tinyint('api_enabled').default(0),
  apiConfig: text('api_config'), // JSON
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Carrier = typeof carriers.$inferSelect;
export type InsertCarrier = typeof carriers.$inferInsert;

// Quotes Table
export const quotes = mysqlTable('quotes', {
  id: int('id').autoincrement().primaryKey(),
  quoteNumber: varchar('quote_number', { length: 20 }).unique().notNull(),
  customerId: int('customer_id').references(() => companies.id),
  origin: text('origin').notNull(), // JSON
  destination: text('destination').notNull(), // JSON
  containerInfo: text('container_info'), // JSON
  serviceType: varchar('service_type', { length: 50 }),
  pickupDate: varchar('pickup_date', { length: 10 }),
  deliveryDate: varchar('delivery_date', { length: 10 }),
  rates: text('rates'), // JSON array
  totalRate: int('total_rate'),
  marginPercent: int('margin_percent'),
  carrierQuotes: text('carrier_quotes'), // JSON array
  selectedCarrierId: int('selected_carrier_id').references(() => carriers.id),
  aiRecommendation: text('ai_recommendation'), // JSON
  status: varchar('status', { length: 30 }).default('draft'),
  validUntil: varchar('valid_until', { length: 10 }),
  createdBy: int('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

// Drivers Table
export const drivers = mysqlTable('drivers', {
  id: int('id').autoincrement().primaryKey(),
  carrierId: int('carrier_id').references(() => carriers.id),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  licenseNumber: varchar('license_number', { length: 50 }),
  licenseExpiry: varchar('license_expiry', { length: 10 }),
  twicNumber: varchar('twic_number', { length: 20 }),
  twicExpiry: varchar('twic_expiry', { length: 10 }),
  equipmentId: int('equipment_id'),
  currentLocation: text('current_location'), // JSON
  status: varchar('status', { length: 20 }).default('available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

// Dispatches/Shipments Table
export const dispatches = mysqlTable('dispatches', {
  id: int('id').autoincrement().primaryKey(),
  dispatchNumber: varchar('dispatch_number', { length: 20 }).unique().notNull(),
  quoteId: int('quote_id').references(() => quotes.id),
  customerId: int('customer_id').references(() => companies.id),
  carrierId: int('carrier_id').references(() => carriers.id),
  driverId: int('driver_id').references(() => drivers.id),
  containerNumber: varchar('container_number', { length: 20 }),
  sealNumber: varchar('seal_number', { length: 20 }),
  billOfLading: varchar('bill_of_lading', { length: 30 }),
  bookingNumber: varchar('booking_number', { length: 30 }),
  origin: text('origin').notNull(), // JSON
  destination: text('destination').notNull(), // JSON
  stops: text('stops'), // JSON array
  pickupAppointment: varchar('pickup_appointment', { length: 30 }),
  deliveryAppointment: varchar('delivery_appointment', { length: 30 }),
  actualPickup: varchar('actual_pickup', { length: 30 }),
  actualDelivery: varchar('actual_delivery', { length: 30 }),
  lastFreeDay: varchar('last_free_day', { length: 10 }),
  cutoffDate: varchar('cutoff_date', { length: 30 }),
  carrierRate: int('carrier_rate'),
  customerRate: int('customer_rate'),
  accessorials: text('accessorials'), // JSON
  totalCost: int('total_cost'),
  totalRevenue: int('total_revenue'),
  grossProfit: int('gross_profit'),
  status: varchar('status', { length: 30 }).default('pending'),
  currentLocation: text('current_location'), // JSON
  eta: varchar('eta', { length: 30 }),
  statusHistory: text('status_history'), // JSON
  documents: text('documents'), // JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Dispatch = typeof dispatches.$inferSelect;
export type InsertDispatch = typeof dispatches.$inferInsert;

// Rate Cards Table
export const rateCards = mysqlTable('rate_cards', {
  id: int('id').autoincrement().primaryKey(),
  carrierId: int('carrier_id').references(() => carriers.id),
  originZone: varchar('origin_zone', { length: 50 }),
  destinationZone: varchar('destination_zone', { length: 50 }),
  containerSize: varchar('container_size', { length: 10 }),
  baseRate: int('base_rate'),
  fuelSurchargePercent: int('fuel_surcharge_percent'),
  chassisFee: int('chassis_fee'),
  portCongestionFee: int('port_congestion_fee'),
  effectiveDate: varchar('effective_date', { length: 10 }),
  expiryDate: varchar('expiry_date', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type RateCard = typeof rateCards.$inferSelect;
export type InsertRateCard = typeof rateCards.$inferInsert;

// Accessorials Table
export const accessorials = mysqlTable('accessorials', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 20 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  defaultRate: int('default_rate'),
  rateType: varchar('rate_type', { length: 20 }), // 'flat', 'per_hour', 'per_day', 'per_mile'
  appliesToTypes: varchar('applies_to_types', { length: 255 }), // JSON array
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Accessorial = typeof accessorials.$inferSelect;
export type InsertAccessorial = typeof accessorials.$inferInsert;

// AI Logs Table
export const aiLogs = mysqlTable('ai_logs', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 50 }),
  interactionType: varchar('interaction_type', { length: 50 }),
  inputData: text('input_data'), // JSON
  outputData: text('output_data'), // JSON
  modelUsed: varchar('model_used', { length: 50 }),
  tokensUsed: int('tokens_used'),
  responseTimeMs: int('response_time_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AILog = typeof aiLogs.$inferSelect;
export type InsertAILog = typeof aiLogs.$inferInsert;