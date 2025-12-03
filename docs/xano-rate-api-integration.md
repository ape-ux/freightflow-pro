# Xano Rate API Integration - Complete Guide

## Overview
This document explains the corrected implementation of the `rate/fetch-rates` endpoint, including all fixes, database requirements, and testing procedures.

---

## What Was Fixed

### 1. **Missing `app_customers_id` in User Query**
**Problem:** The addon wasn't outputting `app_customers_id`, causing it to be undefined.

**Original Code:**
```xano
addon = [
  {
    name  : "Single Customer"
    output: ["id", "eid", "name", "description"]  // ❌ Missing app_customers_id
    input : {App_Customers_id: "app_customers_id"}
    as    : "customer"
  }
]
```

**Fixed Code:**
```xano
output = ["id", "email", "name", "app_customers_id"]  // ✅ Added to main output
addon = [
  {
    name  : "Single Customer"
    output: ["id", "eid", "name", "description", "app_customers_id"]  // ✅ Added here too
    input : {App_Customers_id: "app_customers_id"}
    as    : "customer"
  }
]
```

### 2. **No Validation for Customer Key Lookup**
**Problem:** If `$customer_key` was empty, the function failed silently when accessing `.tai_api_key`.

**Added:**
```xano
precondition (($customer_key|is_empty) == false && ($customer_key.tai_api_key|is_empty) == false) {
  error_type = "not_found"
  error = "Customer API key not found. Please configure your TAI API key in Settings."
  payload = {
    user_id: $auth.id,
    app_customers_id: $user.app_customers_id,
    message: "Missing tai_api_key in Company | Customers | Keys table"
  }
}
```

### 3. **Missing Debug Statements**
**Added comprehensive debug stops at each critical step:**
- After user lookup
- After customer key lookup
- After TAI API verification
- After quotes retrieval

### 4. **Improved Error Messages**
All error messages now include:
- `error_type` (bad_request, unauthorized, not_found, forbidden)
- Descriptive error messages
- `payload` with debugging information

### 5. **Proper API Timeout Handling**
Changed timeout from default to explicit values:
- Authentication verification: 30 seconds
- Rate quote request: 90 seconds

### 6. **Added `app_customers_id` to Quote Record**
The saved quote now includes the customer ID for better tracking:
```xano
db.add "Rate Quotes | User Generated" {
  data = {
    ...
    app_customers_id: $user.app_customers_id  // ✅ Added
    ...
  }
}
```

---

## Database Schema Requirements

### Table: `App | Users`
Required fields:
```
- id (integer, primary key)
- email (text)
- name (text)
- app_customers_id (integer, foreign key to App | Customers)
```

### Table: `App | Customers`
Required fields:
```
- id (integer, primary key)
- eid (text, unique)
- name (text)
- description (text)
```

### Table: `Company | Customers | Keys`
**This is the critical table that was missing data!**
```
- id (integer, primary key)
- app_customers_id (integer, foreign key to App | Customers)
- tai_api_key (text, NOT NULL)
- created_at (timestamp)
- updated_at (timestamp)
```

### Table: `Company | Carriers_v2`
Required fields:
```
- id (integer, primary key)
- name (text)
- is_active (boolean)
```

### Table: `Rate Quotes | User Generated`
Required fields:
```
- id (integer, primary key)
- eid (text, unique)
- app_users_id (integer, foreign key)
- app_customers_id (integer, foreign key)
- quoted_on (timestamp)
- expires_at (timestamp)
- is_expired (boolean)
- quotes (json)
- map_embed (text)
- user_input (json)
- origin_zip (text)
- destination_zip (text)
- created_at (timestamp)
- modified_at (timestamp)
```

### Table: `Options | Accessorial`
Required fields:
```
- id (integer, primary key)
- name (text)
- code (text)
```

---

## Setup Instructions

### Step 1: Verify Database Tables Exist
In Xano, check that all tables listed above exist with the correct fields.

### Step 2: Create Test Data
You need at least one record in `Company | Customers | Keys`:

```sql
-- Example data (adapt to your Xano interface)
INSERT INTO "Company | Customers | Keys" (app_customers_id, tai_api_key)
VALUES (1, 'YOUR_TAI_API_KEY_HERE');
```

**IMPORTANT:** Replace `'YOUR_TAI_API_KEY_HERE'` with your actual TAI Cloud API key!

### Step 3: Link User to Customer
Ensure your test user has an `app_customers_id`:

```sql
-- Update your user record
UPDATE "App | Users"
SET app_customers_id = 1
WHERE id = YOUR_USER_ID;
```

### Step 4: Add Active Carriers
Add some carrier records to filter quotes:

```sql
INSERT INTO "Company | Carriers_v2" (name, is_active)
VALUES
  ('UPS Freight', true),
  ('FedEx Freight', true),
  ('XPO Logistics', true);
```

### Step 5: Configure Accessorial Codes (Optional)
If using accessorial codes:

```sql
INSERT INTO "Options | Accessorial" (name, code)
VALUES
  ('Liftgate Service', 'LIFT'),
  ('Inside Delivery', 'INDEL'),
  ('Residential Delivery', 'RES');
```

---

## Testing the Endpoint

### Test 1: Basic Authentication Check

**Request:**
```bash
curl -X 'POST' \
  'https://YOUR-XANO-INSTANCE.xano.io/api:zPDN1anz/rate/fetch-rates' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: YOUR_AUTH_TOKEN' \
  --data '{
    "data": {
      "OriginZipCode": "90001",
      "DestinationZipCode": "10001",
      "Commodities": [{
        "NMFC": "87700",
        "Width": 48,
        "Height": 48,
        "Length": 48,
        "Description": "Auto Parts - Engines",
        "PiecesTotal": 2,
        "WeightTotal": 2500,
        "FreightClass": 85,
        "PackagingType": "Pallet",
        "HandlingQuantity": 2,
        "HazardousMaterial": false
      }],
      "WeightUnits": "lb",
      "DimensionUnits": "in",
      "AccessorialCodes": [],
      "LegacySupport": false,
      "CustomerReferenceNumber": ""
    }
  }'
```

**Expected Success Response:**
```json
{
  "status": "success",
  "data": {
    "quote_id": "Q-2025-XXXX",
    "quotes": [...],
    "user_input": {...},
    "map_embed": "<iframe>...</iframe>",
    "shipment": {...}
  },
  "has_data": true,
  "alert_message": "Quotes generated successfully!",
  "show_alert": true
}
```

### Test 2: Check Error Handling

**Test Missing ZIP Codes:**
```bash
curl -X 'POST' \
  'https://YOUR-XANO-INSTANCE.xano.io/api:zPDN1anz/rate/fetch-rates' \
  -H 'Authorization: YOUR_AUTH_TOKEN' \
  --data '{"data": {}}'
```

**Expected Error:**
```json
{
  "code": "ERROR_PRECONDITION",
  "message": "Please check your zip codes before proceeding.",
  "payload": {
    "message": "Both OriginZipCode and DestinationZipCode are required"
  }
}
```

### Test 3: Debug Mode
Enable all debug stops in the function to see:
1. User data and `app_customers_id`
2. Customer key lookup results
3. TAI API verification response
4. Quotes returned from API

---

## Common Errors & Solutions

### Error: "Unable to locate var: customer_key.tai_api_key"
**Cause:** The `customer_key` variable is empty/null.

**Solutions:**
1. Check if user has `app_customers_id` set
2. Check if record exists in `Company | Customers | Keys` table
3. Check if `tai_api_key` field has a value
4. Enable debug stops to see exact values

### Error: "User account is not associated with a customer"
**Cause:** `app_customers_id` is null on the user record.

**Solution:**
```sql
UPDATE "App | Users"
SET app_customers_id = 1
WHERE id = YOUR_USER_ID;
```

### Error: "Customer API key not found"
**Cause:** No matching record in `Company | Customers | Keys` table.

**Solution:**
```sql
INSERT INTO "Company | Customers | Keys" (app_customers_id, tai_api_key)
VALUES (1, 'YOUR_ACTUAL_TAI_API_KEY');
```

### Error: "TAI API Authentication Failed"
**Cause:** Invalid or expired TAI API key.

**Solutions:**
1. Verify your TAI API key is correct
2. Check if key is active in TAI Cloud dashboard
3. Test key directly:
```bash
curl -X GET \
  'https://atl.taicloud.net/publicapi/shipping/verifyauthentication/YOUR_KEY' \
  -H 'x-api-key: YOUR_KEY'
```

### Error: "No quotes available from active carriers"
**Cause:** No carriers in the response match your active carriers list.

**Solutions:**
1. Check if you have any active carriers:
```sql
SELECT * FROM "Company | Carriers_v2" WHERE is_active = true;
```
2. Add carriers that match TAI API responses
3. Check debug output for `raw_quote_count` vs `filtered quote count`

---

## API Flow Diagram

```
User Request
    ↓
[1] Validate ZIP Codes
    ↓
[2] Geocode Addresses (Radar API)
    ↓
[3] Get User Record → Check app_customers_id
    ↓
[4] Get Customer API Key → Check tai_api_key exists
    ↓
[5] Verify TAI Authentication
    ↓
[6] Get Valid Accessorial Codes
    ↓
[7] Request Rate Quote (TAI API)
    ↓
[8] Filter by Active Carriers
    ↓
[9] Save to Database (if quotes found)
    ↓
[10] Return Success/Error Response
```

---

## Security Considerations

### 1. **API Key Storage**
- Store TAI API keys in `Company | Customers | Keys` table
- NEVER expose API keys in responses
- Use Xano's environment variables for sensitive values

### 2. **Authentication**
- Always use `auth = "App | Users"` for authenticated endpoints
- Validate user associations before proceeding
- Log failed authentication attempts

### 3. **Rate Limiting**
- Consider adding rate limiting to prevent abuse
- TAI API may have rate limits - handle gracefully

### 4. **Input Validation**
- Always validate ZIP codes
- Sanitize commodity descriptions
- Validate numeric values (weight, dimensions)

---

## Performance Optimization

### 1. **Caching**
Consider caching:
- Active carrier lists (refresh hourly)
- Accessorial code mappings
- Geocoded addresses (by ZIP)

### 2. **Async Operations**
The function makes multiple API calls sequentially. Consider:
- Parallel geocoding requests (origin + destination)
- Background quote expiration cleanup

### 3. **Database Indexes**
Add indexes on:
- `App | Users.app_customers_id`
- `Company | Customers | Keys.app_customers_id`
- `Rate Quotes | User Generated.app_users_id`
- `Rate Quotes | User Generated.expires_at`

---

## Next Steps

1. ✅ Copy corrected function to Xano
2. ✅ Verify all database tables exist
3. ✅ Add test data (user, customer, API key)
4. ✅ Test with debug stops enabled
5. ✅ Test error scenarios
6. ✅ Disable debug stops in production
7. ✅ Monitor logs for issues

---

## Support Functions Required

Ensure these helper functions exist in your Xano workspace:

### `radar/address/autocomplete`
- Input: `query`, `near_me`, `US_only`, `zip_search_only`
- Output: `country`, `city`, `state`, etc.

### `prepare shipment object`
- Input: `user_input`, `backup_location_data`
- Output: Formatted shipment object

### `eid`
- Input: `number`
- Output: Unique EID string

### `common/display-result`
- Input: `status`, `data`, `has_data`, `alert_message`, etc.
- Output: Standardized API response

---

## Questions or Issues?

If you encounter issues:
1. Check debug stop outputs
2. Verify database records exist
3. Test TAI API key independently
4. Review error payloads for clues
5. Check Xano execution logs

For additional help, provide:
- Full error message
- Debug stop outputs
- Database record screenshots
- Request payload used
