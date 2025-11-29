# FreightFlow Pro - Complete Tempo Development Prompt
## AI-Powered Freight Quote & Dispatch Management Platform

---

# PROJECT OVERVIEW

## Vision
Build FreightFlow Pro, a comprehensive freight management platform for drayage and logistics operations. The platform enables users to create quotes, manage dispatches, track shipments, analyze carrier performance, and leverage AI assistance for intelligent decision-making.

## Tech Stack
- **Frontend**: React 18+ with TypeScript, Tailwind CSS, shadcn/ui components
- **State Management**: Zustand or React Query
- **Backend**: Xano (no-code backend) + Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: Claude API (Anthropic), Google Gemini API
- **Maps**: Google Maps Platform (Geocoding, Distance Matrix, Directions)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **PDF Generation**: @react-pdf/renderer

## Design System
- **Primary Color**: Orange (#F97316, orange-500)
- **Secondary**: Indigo (#6366F1), Emerald (#10B981)
- **Background**: Gray-50 (#F9FAFB)
- **Cards**: White with border-gray-100, rounded-xl, shadow-sm
- **Typography**: Inter font family
- **Border Radius**: Mostly rounded-xl (12px)
- **Spacing**: 8px base unit

---

# PHASE 1: FOUNDATION & CORE UI
## Duration: Week 1-2

### Prompt for Phase 1:

```
Create a freight management application called "FreightFlow Pro" with the following foundation:

## 1.1 Project Setup & Configuration

Initialize a React + TypeScript + Vite project with:
- Tailwind CSS with custom orange-500 as primary color
- shadcn/ui component library installed
- Lucide React icons
- React Router v6 for navigation
- Zustand for global state management
- React Query for server state
- React Hook Form + Zod for forms

Create a custom Tailwind config with:
- Extended colors: primary (orange), success (emerald), warning (amber), info (blue)
- Custom shadows for cards
- Animation utilities for loading states

## 1.2 Authentication System

Create authentication pages and flow:

### Login Page (/login)
- Clean centered card design
- Email and password inputs with validation
- "Remember me" checkbox
- "Forgot password?" link
- Sign in button with loading state
- Link to register page
- FreightFlow Pro logo at top

### Register Page (/register)
- Company name, full name, email, password, confirm password
- Terms of service checkbox
- Create account button
- Link back to login

### Forgot Password Page (/forgot-password)
- Email input
- Send reset link button
- Back to login link

### Auth Context/Store
- Create useAuth hook with: user, isAuthenticated, login, logout, register functions
- Protected route wrapper component
- Persist auth state to localStorage

## 1.3 Main Layout Structure

Create the app shell with:

### Sidebar Component (fixed left, 256px width)
- Logo section: Orange "FF" icon + "FreightFlow" text + "Pro" badge
- AI Assistant status indicator (green dot with pulse animation when active)
- Navigation items with icons:
  - Dashboard (BarChart3 icon)
  - Quotes (FileText icon) - with count badge
  - Dispatches (Truck icon) - with count badge
  - Carriers (Users icon)
  - Customers (Building icon)
  - Analytics (TrendingUp icon)
  - Settings (Settings icon)
- Active state: orange-50 background, orange-600 text
- Hover state: gray-50 background
- Collapsible on mobile (hamburger menu)

### Header Component (sticky top)
- Search bar with icon (placeholder: "Search quotes, shipments, carriers...")
- Notification bell with red badge for unread count
- User avatar dropdown with:
  - User name and email
  - Profile settings link
  - Logout button

### Main Content Area
- Scrollable with padding
- Page title and breadcrumb section
- Content area

## 1.4 Dashboard Page (/)

Create the main dashboard with these sections:

### KPI Cards Row (4 cards, responsive grid)
Each card shows:
- Title (gray-500, small text)
- Value (large bold number)
- Trend indicator (up/down arrow with percentage)
- "vs last month" text
- Colored icon in rounded square

Cards:
1. Active Shipments - indigo icon (Package)
2. Pending Quotes - emerald icon (FileText)
3. Monthly Revenue - orange icon (DollarSign)
4. Avg. Transit Time - amber icon (Timer)

### Quick Actions Section
4 action buttons in a grid:
1. New Quote (Plus icon)
2. Create Dispatch (Truck icon)
3. Track Shipment (MapPin icon)
4. View Reports (BarChart3 icon)

Hover effect: orange border, slight shadow

### Two-Column Section

**Left: Active Shipments Card**
- Header with "Active Shipments" title and count badge
- List of shipment cards showing:
  - Container number with container icon
  - Status badge (In Transit = blue, At Pickup = orange, Delivered = green)
  - Origin → Destination with MapPin icon
  - ETA with Clock icon
- "View All" link at bottom

**Right: Recent Quotes Card**
- Header with "Recent Quotes" title and "View All" link
- List of quote items showing:
  - Quote number (Q-2025-XXXX format)
  - Status badge (Pending = yellow, Accepted = green, Expired = red)
  - Customer company name
  - Route (Origin → Destination)
  - Price in orange bold
  - Time ago (2 hours ago, etc.)

## 1.5 Reusable Components Library

Create these base components in /components/ui/:

### StatusBadge
- Variants: pending, accepted, expired, in-transit, delivered, at-pickup, cancelled
- Each with appropriate background and text color

### KPICard
- Props: title, value, change, changeType (up/down), icon, iconColor

### DataTable
- Sortable columns
- Pagination
- Row selection
- Loading skeleton
- Empty state

### Modal/Dialog
- Centered overlay
- Close button
- Header, body, footer sections
- Sizes: sm, md, lg, xl

### Dropdown Menu
- Trigger element
- Menu items with icons
- Dividers
- Keyboard navigation

### Toast Notifications
- Success, error, warning, info variants
- Auto-dismiss with progress bar
- Stack multiple toasts

### LoadingSpinner
- Sizes: sm, md, lg
- Can be used inline or full-page overlay

### EmptyState
- Icon, title, description, action button
- Used when lists are empty

### ConfirmDialog
- Title, message
- Cancel and confirm buttons
- Destructive variant with red confirm button

## 1.6 Mock Data & Types

Create TypeScript interfaces in /types/:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: 'admin' | 'dispatcher' | 'sales' | 'viewer';
  avatar?: string;
}

interface Company {
  id: string;
  name: string;
  type: 'shipper' | 'consignee' | 'broker' | 'carrier';
  mcNumber?: string;
  dotNumber?: string;
  address: Address;
  contacts: Contact[];
  creditLimit?: number;
  paymentTerms: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface Carrier {
  id: string;
  name: string;
  mcNumber: string;
  dotNumber?: string;
  scacCode?: string;
  serviceTypes: ('drayage' | 'OTR' | 'LTL' | 'rail')[];
  equipmentTypes: string[];
  serviceAreas: string[];
  rating: number;
  insuranceExpiry: string;
  status: 'active' | 'inactive' | 'pending';
}

interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  origin: Location;
  destination: Location;
  containerInfo: ContainerInfo;
  serviceType: 'port_drayage' | 'transload' | 'OTR' | 'LTL';
  pickupDate: string;
  deliveryDate?: string;
  rates: RateBreakdown;
  totalRate: number;
  marginPercent: number;
  carrierQuotes: CarrierQuote[];
  selectedCarrierId?: string;
  status: 'draft' | 'pending' | 'accepted' | 'expired' | 'declined';
  validUntil: string;
  createdAt: string;
  createdBy: string;
}

interface Dispatch {
  id: string;
  dispatchNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  carrierId: string;
  carrierName: string;
  driverId?: string;
  driverName?: string;
  containerNumber?: string;
  sealNumber?: string;
  billOfLading?: string;
  origin: Location;
  destination: Location;
  stops: Stop[];
  pickupAppointment: string;
  deliveryAppointment: string;
  actualPickup?: string;
  actualDelivery?: string;
  lastFreeDay?: string;
  carrierRate: number;
  customerRate: number;
  accessorials: Accessorial[];
  totalCost: number;
  totalRevenue: number;
  grossProfit: number;
  status: DispatchStatus;
  currentLocation?: { lat: number; lng: number; address: string };
  eta?: string;
  statusHistory: StatusUpdate[];
  documents: Document[];
  createdAt: string;
}

type DispatchStatus = 'pending' | 'dispatched' | 'at_pickup' | 'in_transit' | 'at_delivery' | 'delivered' | 'completed' | 'cancelled';
```

Create mock data files with 10-20 sample records for each entity.

## 1.7 API Service Layer

Create /services/api.ts with:
- Base axios/fetch instance with auth headers
- API endpoints object
- Generic request function with error handling
- Mock mode toggle for development

Create service files:
- authService.ts (login, register, logout, refreshToken)
- quotesService.ts (getAll, getById, create, update, delete)
- dispatchService.ts (getAll, getById, create, update, updateStatus)
- carrierService.ts (getAll, getById, create, update, getRates)
- customerService.ts (getAll, getById, create, update)

Each service should:
- Use React Query hooks (useQuery, useMutation)
- Have proper TypeScript types
- Include loading and error states
- Support pagination and filtering
```

---

# PHASE 2: QUOTING & RATE MANAGEMENT
## Duration: Week 3-4

### Prompt for Phase 2:

```
Continue building FreightFlow Pro with the complete quoting system:

## 2.1 Quotes List Page (/quotes)

Create a quotes management page with:

### Header Section
- Page title "Quotes" with count
- Filter tabs: All | Draft | Pending | Accepted | Expired
- Search input for quote number, customer name
- Date range filter
- "New Quote" primary button

### Quotes Table
Columns:
- Checkbox for bulk selection
- Quote # (clickable link to detail)
- Customer (company name)
- Origin → Destination (abbreviated)
- Service Type (badge)
- Container (size and type)
- Total Rate (formatted currency)
- Margin % 
- Status (colored badge)
- Valid Until (date, red if expired/expiring soon)
- Created (relative time)
- Actions dropdown (View, Edit, Duplicate, Delete)

Features:
- Sortable columns
- Pagination (25 per page default)
- Bulk actions: Delete, Export to CSV
- Row click opens detail sidebar or navigates to detail page
- Empty state with illustration when no quotes

## 2.2 Quote Detail Page (/quotes/:id)

### Header
- Back button
- Quote number as title
- Status badge
- Action buttons: Edit, Duplicate, Send to Customer, Convert to Dispatch

### Three-Column Layout

**Column 1: Shipment Details**
Card with:
- Service Type
- Origin (address, port code if applicable)
- Destination (address)
- Distance (miles)
- Estimated Transit (days)
- Pickup Date
- Delivery Date (if set)

**Column 2: Container & Cargo**
Card with:
- Container Size (20', 40', 40HC, 45')
- Container Type (Dry, Reefer, etc.)
- Gross Weight
- Commodity
- Hazmat (Yes/No with class if yes)
- Special Requirements

**Column 3: Customer Info**
Card with:
- Customer company name
- Contact name
- Phone
- Email
- Payment terms
- Credit status

### Rate Breakdown Section
Table showing:
- Line item description
- Quantity
- Unit price
- Total
- Items: Base Drayage, Fuel Surcharge, Chassis Fee, Port Congestion, Tolls, etc.
- Subtotal row
- Margin row (percentage and amount)
- Grand Total row (highlighted)

### Carrier Quotes Section
If carrier quotes have been requested:
- Table of carrier responses
- Columns: Carrier, Rate, Transit Days, Valid Until, Status
- "Select" button for each
- AI Recommendation badge on suggested carrier

### Activity Timeline
- Status changes
- Emails sent
- Notes added
- User who made changes

## 2.3 New/Edit Quote Form (/quotes/new, /quotes/:id/edit)

Multi-step wizard form:

### Step 1: Customer & Service
- Customer dropdown (searchable) with "Add New" option
- Service type selection (cards): Port Drayage, Transload, OTR, LTL
- Special icons and descriptions for each

### Step 2: Locations
- Origin section:
  - Port/Terminal dropdown (if drayage)
  - OR Address autocomplete (Google Places)
  - City, State, ZIP auto-filled
  - Contact name and phone for pickup
  - Pickup appointment date/time
  
- Destination section:
  - Address autocomplete
  - City, State, ZIP
  - Delivery contact
  - Requested delivery date
  
- Map preview showing route (Google Maps embed)
- Calculated distance and estimated transit time

### Step 3: Cargo Details
- Container size dropdown
- Container type dropdown
- Weight input (lbs)
- Commodity input (with common suggestions)
- Hazmat toggle (if yes, show class dropdown)
- Special equipment checkboxes: Liftgate, Inside Delivery, Appointment Required
- Notes/special instructions textarea

### Step 4: Pricing
- Auto-calculated base rate based on:
  - Origin/destination zones
  - Distance
  - Container size
  - Service type
  
- Editable rate components:
  - Base Rate (input)
  - Fuel Surcharge (% or fixed)
  - Chassis Fee
  - Port Congestion Fee
  - Tolls
  - Add custom line item button
  
- Margin calculator:
  - Cost inputs (what we pay carrier)
  - Target margin % slider
  - Auto-calculate customer rate
  
- Total quote amount (large, bold)
- Valid until date picker

### Step 5: Review & Submit
- Summary of all entered information
- Edit buttons for each section
- Submit buttons: Save as Draft, Send Quote, Get Carrier Rates

### AI Assist Button
Floating button that opens AI assistant panel:
- "Help me price this quote"
- "Check market rates for this lane"
- "Suggest optimal margin"

## 2.4 Carrier Rates Modal

When "Get Carrier Rates" is clicked:

### Modal with tabs:
1. **Contract Carriers** - Your negotiated rates
2. **API Carriers** - Real-time rates from integrations
3. **Spot Market** - DAT/load board rates

### Each carrier card shows:
- Carrier name and logo
- Total rate
- Transit time
- Service level
- Rate breakdown expandable
- Carrier rating (stars)
- On-time percentage
- "Select" button

### AI Recommendation Panel
- "Best Value" badge on recommended carrier
- Explanation of why this carrier is recommended
- Risk factors if any
- Alternative options

## 2.5 Rate Cards Management (/settings/rate-cards)

### Rate Cards List
- Table of all rate cards
- Columns: Origin Zone, Destination Zone, Container Size, Base Rate, Fuel %, Effective Date, Expiry
- Quick edit inline
- Bulk upload from CSV

### Add/Edit Rate Card Modal
- Origin zone dropdown or input
- Destination zone dropdown or input
- Container size multi-select
- Base rate input
- Fuel surcharge percentage
- Additional fees section
- Effective and expiry dates

### Zone Management
- Define geographic zones
- Assign ZIP code ranges to zones
- Visual map of zones

## 2.6 Customer Quick-Add Modal

When "Add New" customer is clicked from quote form:

### Basic Info Tab
- Company name (required)
- Company type dropdown
- MC Number
- DOT Number
- Tax ID

### Address Tab
- Street address
- City
- State dropdown
- ZIP
- Country

### Contact Tab
- Primary contact name
- Email
- Phone
- Additional contacts (add more)

### Billing Tab
- Payment terms dropdown (Net 15, 30, 45, 60)
- Credit limit input
- Billing email
- Notes

Save button creates customer and auto-selects in quote form.
```

---

# PHASE 3: DISPATCH & TRACKING
## Duration: Week 5-6

### Prompt for Phase 3:

```
Continue building FreightFlow Pro with dispatch management and tracking:

## 3.1 Dispatch Board Page (/dispatches)

Create a dispatch board with multiple view options:

### Header
- "Dispatches" title with count
- View toggle: List | Board | Calendar | Map
- Filter dropdowns: Status, Carrier, Date Range, Location
- Search input
- "New Dispatch" button

### List View (default)
Table with columns:
- Dispatch # (link)
- Container #
- Customer
- Carrier
- Driver
- Origin → Destination
- Pickup Date/Time
- Delivery Date/Time
- Status (colored badge)
- Actions

Features:
- Group by date option
- Group by status option
- Expandable rows showing full details
- Quick status update buttons

### Board View (Kanban-style)
Columns for each status:
- Pending
- Dispatched
- At Pickup
- In Transit
- At Delivery
- Delivered

Each card shows:
- Dispatch # and Container #
- Customer name
- Route (abbreviated)
- ETA or appointment time
- Driver name (if assigned)
- Drag and drop between columns to update status

### Calendar View
Monthly/weekly calendar showing:
- Pickup appointments (orange dots)
- Delivery appointments (green dots)
- Click on day to see list of dispatches
- Drag to reschedule (updates appointment)

### Map View
Full-screen Google Map showing:
- All active shipments as markers
- Color coded by status
- Click marker shows info window with dispatch details
- "Track" button to follow specific shipment
- Toggle layers: Traffic, Route lines

## 3.2 Dispatch Detail Page (/dispatches/:id)

### Header Section
- Back button
- Dispatch # as title
- Container # subtitle
- Large status badge
- Action buttons: Update Status, Edit, Assign Driver, Add Note, Print BOL

### Status Timeline (horizontal)
Visual timeline showing:
- Pending → Dispatched → At Pickup → In Transit → At Delivery → Delivered
- Current status highlighted
- Timestamps for completed statuses
- Click on next status to advance

### Main Content Grid

**Shipment Info Card**
- Customer name and contact
- Bill of Lading #
- Booking #
- Container # and Seal #
- Commodity
- Weight

**Route Card**
- Origin with full address
- Pickup appointment (date/time)
- Actual pickup (if completed)
- Destination with full address
- Delivery appointment
- Actual delivery (if completed)
- Last Free Day (highlighted if approaching)
- Small map preview

**Carrier & Driver Card**
- Carrier name with rating
- Driver name
- Driver phone (click to call)
- Equipment type
- Current location (if tracking)
- ETA

**Financials Card**
- Carrier Rate
- Customer Rate
- Accessorial charges (list)
- Total Cost
- Total Revenue
- Gross Profit (highlighted, green if positive)
- Margin %

### Accessorials Section
Table of additional charges:
- Description
- Amount
- Billable to customer (checkbox)
- Add accessorial button

Common accessorials dropdown:
- Detention
- Per Diem
- Liftgate
- Lumper
- Re-delivery
- Storage

### Documents Section
- Upload area (drag and drop)
- List of attached documents:
  - Rate Confirmation
  - Bill of Lading
  - Proof of Delivery
  - Weight Ticket
  - Photos
- View/download buttons
- AI Extract button (uses Gemini to extract data from uploaded docs)

### Notes & Activity
- Add note textarea
- Activity feed showing:
  - Status changes with timestamps
  - Notes added
  - Documents uploaded
  - Emails sent
  - User who performed action

## 3.3 New Dispatch Form (/dispatches/new)

### Option 1: From Quote
- Select existing accepted quote
- Pre-fills all information
- Just need to add container # and carrier/driver

### Option 2: Manual Entry
Multi-step form:

**Step 1: Customer & Shipment**
- Customer dropdown
- Container number input
- Seal number input
- Bill of Lading input
- Booking number input
- Commodity
- Weight

**Step 2: Locations & Schedule**
- Origin (can be port/terminal or address)
- Pickup appointment date/time picker
- Destination address
- Delivery appointment date/time picker
- Stops section (add intermediate stops)
- Last Free Day date picker

**Step 3: Carrier Assignment**
- Carrier dropdown (filtered by service area and equipment)
- Driver dropdown (filtered by carrier)
- Or "Assign Later" option
- Equipment type confirmation
- Special instructions for carrier

**Step 4: Financials**
- Carrier rate input
- Customer rate input
- Add accessorials
- Calculate totals

**Step 5: Documents**
- Upload rate confirmation
- Upload BOL if available
- Notes

**Step 6: Review & Create**
- Summary
- Create & Dispatch button
- Create as Pending button

## 3.4 Quick Status Update Modal

When updating status from list or detail:

### Modal Content
- Current status display
- Next status options (only valid transitions)
- Timestamp (defaults to now, can change)
- Location input (auto-detect or manual)
- Notes textarea
- Update button

### Status Transitions
- pending → dispatched (requires carrier assigned)
- dispatched → at_pickup
- at_pickup → in_transit
- in_transit → at_delivery
- at_delivery → delivered
- any → cancelled (requires reason)

### Automated Actions
- When delivered: prompt to upload POD
- When cancelled: prompt for cancellation reason
- Send notification to customer (checkbox)

## 3.5 Driver Assignment Modal

### Search & Filter
- Search by driver name
- Filter by carrier
- Filter by availability

### Driver Cards
Show available drivers:
- Driver name
- Carrier name
- Phone number
- Equipment type
- Current location
- Current status (Available, On Load, Off Duty)
- "Assign" button

### Send Dispatch
After assigning:
- Send dispatch details to driver (email/SMS toggle)
- Include pickup instructions
- Include delivery instructions

## 3.6 Live Tracking Panel

### Tracking View
- Large map centered on shipment
- Route line from origin to destination
- Current position marker (truck icon)
- Remaining route highlighted
- ETA display
- Distance remaining

### Updates Feed
- Real-time location updates
- Driver check-ins
- Milestone events (departed, arrived, etc.)

### Share Tracking
- Generate customer tracking link
- Copy link button
- Send via email button

## 3.7 Dispatch Reports Section

### Today's Dispatches Widget
- Pickups today (count and list)
- Deliveries today (count and list)
- In transit (count)
- Exceptions/delays (highlighted red)

### Performance Metrics
- On-time pickup rate
- On-time delivery rate
- Average transit time by lane
- Exception rate

### Export Options
- Export dispatch list to CSV
- Export to Excel with formatting
- Print dispatch sheet
- Generate manifest (multiple dispatches)
```

---

# PHASE 4: AI FEATURES & ANALYTICS
## Duration: Week 7-8

### Prompt for Phase 4:

```
Complete FreightFlow Pro with AI-powered features and analytics:

## 4.1 AI Assistant Chat Panel

### Sliding Panel Design
- Slide in from right side
- 400px width
- Toggle button always visible on right edge (with Sparkles icon)
- Header: "AI Assistant" with status indicator
- Collapsible/expandable

### Chat Interface
- Message bubbles (user on right, AI on left)
- AI avatar with FreightFlow branding
- Typing indicator animation
- Timestamp on hover
- Copy message button
- Thumbs up/down feedback

### Input Area
- Multi-line text input
- Send button
- Suggested prompts chips:
  - "Help me create a quote"
  - "Find best carrier for this lane"
  - "Show me today's dispatches"
  - "Analyze my margins this month"
  - "What's the market rate for LA to Phoenix?"

### AI Capabilities
The AI should be able to:

1. **Quote Assistance**
   - "Create a quote for [customer] from [origin] to [destination]"
   - "What should I charge for a 40HC from Port Newark to Chicago?"
   - "Check if this rate is competitive"
   - Opens quote form pre-filled with AI suggestions

2. **Carrier Recommendations**
   - "Who's the best carrier for LA drayage?"
   - "Compare carriers for this shipment"
   - Shows carrier comparison with AI reasoning

3. **Dispatch Help**
   - "Show me all pending dispatches"
   - "What deliveries are scheduled for today?"
   - "Is container XXXX on track?"
   - Shows relevant data inline

4. **Analytics Queries**
   - "What's my gross profit this month?"
   - "Which lane is most profitable?"
   - "Show carrier performance comparison"
   - Generates charts inline

5. **Document Processing**
   - "Extract data from this rate confirmation"
   - "Read this BOL"
   - Uses vision API to process uploaded images

### Context Awareness
- AI knows current page context
- AI knows user role and permissions
- AI can reference current quote/dispatch being viewed
- AI remembers conversation history within session

## 4.2 AI Quote Optimization

### Optimize Rate Button on Quote Form
Opens modal showing:

**Market Analysis**
- Current market rate for lane
- Rate trend (up/down/stable)
- Capacity indicator
- Seasonality notes

**Customer Analysis**
- Customer's historical acceptance rate
- Average rate they've accepted
- Price sensitivity score
- Relationship tenure

**Recommendation**
- Suggested rate range
- Recommended rate with reasoning
- Margin impact
- Win probability estimate

**Alternative Scenarios**
- Budget option (lower margin, higher win rate)
- Premium option (higher margin, lower win rate)
- Apply button for each option

## 4.3 Intelligent Carrier Selection

### Enhanced Carrier Selection Modal

**AI Analysis Section**
- Overall recommendation with confidence score
- Key factors considered:
  - Price competitiveness
  - Historical on-time performance
  - Lane experience
  - Current capacity
  - Relationship quality

**Carrier Comparison Table**
Enhanced columns:
- AI Score (composite rating)
- Price vs Market (above/below/at)
- On-Time % for this lane
- Claims rate
- Communication score
- "Why" button explaining score

**Risk Alerts**
- "This carrier has had delays on this lane recently"
- "Price is 15% above market average"
- "Carrier has capacity constraints this week"

## 4.4 Document AI Processing

### Document Upload with AI
When uploading documents:

**Processing Indicator**
- "AI is analyzing document..."
- Progress animation

**Extracted Data Preview**
- Confidence scores for each field
- Editable fields to correct AI extraction
- "Apply" button to fill form fields

**Supported Documents**
1. Rate Confirmations → Extract carrier rate, dates, equipment
2. Bills of Lading → Extract container #, shipper, consignee, weight
3. Proof of Delivery → Extract delivery time, signature confirmation
4. Rate Cards (images) → Extract and import rate table

### Batch Processing
- Upload multiple documents
- AI categorizes and processes each
- Review all extractions
- Bulk apply to system

## 4.5 Analytics Dashboard (/analytics)

### Header
- Date range selector
- Location filter (NYC, LAX, All)
- Export report button

### KPI Summary Row
- Total Revenue
- Total Cost
- Gross Profit
- Margin %
- Quote Win Rate
- On-Time Delivery %

### Revenue & Profit Chart
- Line/area chart showing monthly trends
- Revenue line
- Cost line
- Profit area (shaded)
- Toggle: Daily/Weekly/Monthly

### Margin Analysis Chart
- Bar chart by customer or lane
- Sort by volume or margin %
- Click bar to drill down

### Top Performers Section (3 columns)

**Top Customers**
- Ranked list by revenue
- Show revenue, loads, margin
- Trend indicator

**Top Lanes**
- Origin-Destination pairs
- Volume, avg rate, margin
- Growth vs last period

**Top Carriers**
- By volume used
- On-time %, cost efficiency
- Rating trend

### Carrier Performance Scorecard
- Table of all carriers used
- Columns: Carrier, Loads, Revenue, Avg Rate, On-Time %, Claims, Rating
- Sparkline for trend
- Compare button to see head-to-head

### Lane Analysis
- Heatmap or table of all lanes
- Color coded by profitability
- Click to see lane details:
  - Historical rates
  - Volume trend
  - Top carriers for lane
  - Market rate comparison

### Quote Conversion Funnel
- Visual funnel showing:
  - Quotes Created
  - Quotes Sent
  - Quotes Viewed (if tracking)
  - Quotes Accepted
  - Converted to Dispatch
- Conversion rate at each stage

## 4.6 Automated Insights

### Daily Digest (shown on dashboard)
AI-generated insights card showing:
- "Your margin improved 3% this week, driven by LA-Phoenix lane"
- "Carrier ABC has missed 2 deliveries - consider alternative"
- "Quote volume is up 20% - consider hiring"
- "You have 5 quotes expiring today"

### Alert System
Configurable alerts:
- Quote expiring soon
- Delivery approaching Last Free Day
- Carrier performance drop
- Unusual rate variance
- High-value customer activity

### Weekly Email Report
- Summary of key metrics
- Top performing lanes
- Issues to address
- AI recommendations

## 4.7 Settings & Configuration (/settings)

### Company Profile
- Company name, logo upload
- Address
- Contact information
- MC/DOT numbers

### User Management
- List of users
- Invite new user
- Role assignment
- Deactivate user

### API Integrations
- Carrier API connections
- Status indicator (connected/disconnected)
- Test connection button
- API key management

### AI Settings
- AI model selection (if options)
- Context preferences
- Disable AI features toggle
- Data privacy settings

### Notification Preferences
- Email notifications toggles
- In-app notifications toggles
- Daily digest preference

### Rate Settings
- Default margins
- Fuel surcharge percentage
- Standard accessorial rates
- Auto-apply rules

## 4.8 Mobile Responsiveness

Ensure all pages work on mobile:

### Mobile Navigation
- Hamburger menu
- Slide-out sidebar
- Bottom tab bar for main sections

### Mobile Dashboard
- Stacked KPI cards
- Scrollable quick actions
- Simplified tables with card view option

### Mobile Forms
- Full-width inputs
- Stepped wizard with progress
- Native date pickers
- Touch-friendly buttons

### Mobile Dispatch
- Card-based list view
- Swipe actions for status update
- Large tap targets
- Click-to-call for driver numbers
```

---

# IMPLEMENTATION NOTES FOR TEMPO

## API Mocking Strategy
Until Xano/Supabase are connected:
1. Create /mocks folder with JSON data files
2. Use MSW (Mock Service Worker) for realistic API simulation
3. Add artificial delays to simulate network latency
4. Include error scenarios for testing

## State Management Pattern
```typescript
// Use Zustand for UI state
const useUIStore = create((set) => ({
  sidebarOpen: true,
  aiPanelOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAIPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
}));

// Use React Query for server state
const useQuotes = () => useQuery(['quotes'], fetchQuotes);
const useCreateQuote = () => useMutation(createQuote);
```

## Component File Structure
```
/src
  /components
    /ui (shadcn components)
    /layout (Sidebar, Header, etc.)
    /quotes (QuoteCard, QuoteForm, etc.)
    /dispatches (DispatchCard, StatusBadge, etc.)
    /carriers (CarrierCard, RateTable, etc.)
    /analytics (Charts, KPICard, etc.)
    /ai (ChatPanel, InsightCard, etc.)
  /pages
  /hooks
  /services
  /stores
  /types
  /utils
  /mocks
```

## Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

# SUCCESS CRITERIA

## Phase 1 Complete When:
- [ ] User can register, login, logout
- [ ] Dashboard displays with all KPI cards and widgets
- [ ] Navigation between all main sections works
- [ ] Responsive on desktop and mobile
- [ ] All reusable components created and documented

## Phase 2 Complete When:
- [ ] User can create, edit, view, delete quotes
- [ ] Multi-step quote wizard works with validation
- [ ] Rate calculation logic implemented
- [ ] Carrier rate comparison modal works
- [ ] Quote status management works

## Phase 3 Complete When:
- [ ] User can create, edit, view dispatches
- [ ] All dispatch views work (list, board, calendar, map)
- [ ] Status updates work with proper transitions
- [ ] Document upload and management works
- [ ] Driver assignment works

## Phase 4 Complete When:
- [ ] AI chat panel is functional
- [ ] AI can answer freight-related questions
- [ ] Analytics dashboard displays all charts
- [ ] Document AI extraction works
- [ ] Mobile experience is polished
- [ ] Settings pages complete

---

*End of Tempo Development Prompt*
*Version: 1.0*
*Project: FreightFlow Pro*
