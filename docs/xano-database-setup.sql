-- ============================================
-- XANO DATABASE SETUP FOR RATE API INTEGRATION
-- ============================================
-- Note: This is pseudo-SQL for reference.
-- Actual implementation will be done through Xano's UI.
-- ============================================

-- ============================================
-- 1. VERIFY/CREATE TABLE: Company | Customers | Keys
-- ============================================
-- This is the CRITICAL table that must exist!

CREATE TABLE IF NOT EXISTS "Company | Customers | Keys" (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    app_customers_id INTEGER NOT NULL,
    tai_api_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraint
    FOREIGN KEY (app_customers_id) REFERENCES "App | Customers" (id) ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX idx_customer_keys_app_customers_id ON "Company | Customers | Keys" (app_customers_id);

-- ============================================
-- 2. ENSURE App | Users HAS app_customers_id
-- ============================================
-- Check if the column exists, if not add it

ALTER TABLE "App | Users"
ADD COLUMN IF NOT EXISTS app_customers_id INTEGER;

-- Add foreign key constraint
ALTER TABLE "App | Users"
ADD CONSTRAINT fk_users_customers
FOREIGN KEY (app_customers_id) REFERENCES "App | Customers" (id) ON DELETE SET NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_users_app_customers_id ON "App | Users" (app_customers_id);

-- ============================================
-- 3. VERIFY TABLE: App | Customers
-- ============================================

CREATE TABLE IF NOT EXISTS "App | Customers" (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    eid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 4. VERIFY TABLE: Company | Carriers_v2
-- ============================================

CREATE TABLE IF NOT EXISTS "Company | Carriers_v2" (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    mc_number TEXT,
    dot_number TEXT,
    scac_code TEXT,
    rating DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_carriers_is_active ON "Company | Carriers_v2" (is_active);

-- ============================================
-- 5. VERIFY TABLE: Rate Quotes | User Generated
-- ============================================

CREATE TABLE IF NOT EXISTS "Rate Quotes | User Generated" (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    eid TEXT UNIQUE NOT NULL,
    app_users_id INTEGER NOT NULL,
    app_customers_id INTEGER NOT NULL,
    quoted_on TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_expired BOOLEAN DEFAULT false,
    quotes JSON,
    map_embed TEXT,
    user_input JSON,
    origin_zip TEXT,
    destination_zip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (app_users_id) REFERENCES "App | Users" (id) ON DELETE CASCADE,
    FOREIGN KEY (app_customers_id) REFERENCES "App | Customers" (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quotes_app_users_id ON "Rate Quotes | User Generated" (app_users_id);
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON "Rate Quotes | User Generated" (expires_at);
CREATE INDEX IF NOT EXISTS idx_quotes_is_expired ON "Rate Quotes | User Generated" (is_expired);

-- ============================================
-- 6. VERIFY TABLE: Options | Accessorial
-- ============================================

CREATE TABLE IF NOT EXISTS "Options | Accessorial" (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accessorial_name ON "Options | Accessorial" (name);
CREATE INDEX IF NOT EXISTS idx_accessorial_code ON "Options | Accessorial" (code);

-- ============================================
-- 7. INSERT TEST DATA
-- ============================================

-- Insert test customer
INSERT INTO "App | Customers" (eid, name, description)
VALUES ('CUST-001', 'Test Customer Inc', 'Test customer for development')
ON CONFLICT (eid) DO NOTHING;

-- Insert TAI API key for test customer
-- ⚠️ REPLACE 'YOUR_ACTUAL_TAI_API_KEY' WITH YOUR REAL KEY!
INSERT INTO "Company | Customers | Keys" (app_customers_id, tai_api_key)
SELECT id, 'YOUR_ACTUAL_TAI_API_KEY'
FROM "App | Customers"
WHERE eid = 'CUST-001'
ON CONFLICT (app_customers_id) DO UPDATE SET tai_api_key = 'YOUR_ACTUAL_TAI_API_KEY';

-- Link test user to customer
-- ⚠️ REPLACE '1' WITH YOUR ACTUAL TEST USER ID!
UPDATE "App | Users"
SET app_customers_id = (SELECT id FROM "App | Customers" WHERE eid = 'CUST-001')
WHERE id = 1;

-- Insert sample active carriers
INSERT INTO "Company | Carriers_v2" (name, is_active, mc_number)
VALUES
    ('UPS Freight', true, 'MC-1234567'),
    ('FedEx Freight', true, 'MC-2345678'),
    ('XPO Logistics', true, 'MC-3456789'),
    ('Old Dominion', true, 'MC-4567890'),
    ('Estes Express', true, 'MC-5678901'),
    ('R+L Carriers', true, 'MC-6789012'),
    ('YRC Freight', true, 'MC-7890123'),
    ('ABF Freight', true, 'MC-8901234'),
    ('SAIA', true, 'MC-9012345'),
    ('Holland', true, 'MC-0123456')
ON CONFLICT DO NOTHING;

-- Insert common accessorial codes
INSERT INTO "Options | Accessorial" (name, code, description)
VALUES
    ('Liftgate Service', 'LIFT', 'Liftgate required for pickup or delivery'),
    ('Inside Delivery', 'INDEL', 'Delivery inside building beyond loading dock'),
    ('Residential Delivery', 'RES', 'Delivery to residential address'),
    ('Limited Access', 'LIMACC', 'Delivery location has limited access'),
    ('Appointment Required', 'APPT', 'Appointment required for delivery'),
    ('Notification Prior', 'NOTIFY', 'Notification required prior to delivery'),
    ('Hazmat', 'HAZ', 'Hazardous materials handling'),
    ('Trade Show', 'TRADE', 'Trade show delivery'),
    ('Construction Site', 'CONST', 'Delivery to construction site'),
    ('After Hours', 'AFTER', 'After hours delivery')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================

-- Check user has customer association
SELECT
    u.id AS user_id,
    u.email,
    u.name,
    u.app_customers_id,
    c.name AS customer_name,
    c.eid AS customer_eid
FROM "App | Users" u
LEFT JOIN "App | Customers" c ON u.app_customers_id = c.id
WHERE u.id = 1;  -- Replace with your user ID

-- Check customer has API key
SELECT
    c.id AS customer_id,
    c.name AS customer_name,
    ck.id AS key_id,
    CASE
        WHEN ck.tai_api_key IS NULL THEN 'NO KEY'
        WHEN ck.tai_api_key = '' THEN 'EMPTY KEY'
        ELSE 'KEY EXISTS'
    END AS key_status,
    ck.created_at
FROM "App | Customers" c
LEFT JOIN "Company | Customers | Keys" ck ON c.id = ck.app_customers_id
WHERE c.eid = 'CUST-001';

-- Check active carriers
SELECT
    COUNT(*) AS active_carrier_count,
    GROUP_CONCAT(name) AS carrier_names
FROM "Company | Carriers_v2"
WHERE is_active = true;

-- Check accessorial codes
SELECT
    COUNT(*) AS accessorial_count,
    GROUP_CONCAT(code) AS codes
FROM "Options | Accessorial";

-- ============================================
-- 9. CLEANUP (USE WITH CAUTION!)
-- ============================================

-- Remove test data if needed
-- UNCOMMENT ONLY IF YOU WANT TO DELETE TEST DATA!

/*
DELETE FROM "Rate Quotes | User Generated" WHERE app_users_id = 1;
DELETE FROM "Company | Customers | Keys" WHERE app_customers_id = (SELECT id FROM "App | Customers" WHERE eid = 'CUST-001');
UPDATE "App | Users" SET app_customers_id = NULL WHERE id = 1;
DELETE FROM "App | Customers" WHERE eid = 'CUST-001';
*/

-- ============================================
-- NOTES FOR XANO IMPLEMENTATION
-- ============================================

/*
Since Xano uses a visual interface, follow these steps:

1. Go to Database section in Xano
2. Create each table using the "Add Table" button
3. Add fields matching the schema above
4. Set up relationships (addons) between tables
5. Add test data using the "Add Record" interface
6. Run verification queries in the Query Builder

CRITICAL FIELDS TO VERIFY:
- App | Users MUST have 'app_customers_id' field
- Company | Customers | Keys MUST exist with 'tai_api_key' field
- Company | Carriers_v2 MUST have 'is_active' boolean field

RELATIONSHIPS (ADDONS):
- App | Users → App | Customers (Many to One)
- Company | Customers | Keys → App | Customers (Many to One)
- Rate Quotes | User Generated → App | Users (Many to One)
- Rate Quotes | User Generated → App | Customers (Many to One)
*/
