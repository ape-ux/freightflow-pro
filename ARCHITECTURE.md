# FreightFlow Pro - Architecture & Development Guide

## Project Overview

FreightFlow Pro is an AI-powered freight quote and dispatch platform designed for logistics companies. It combines intelligent pricing analysis, real-time dispatch management, and carrier optimization to streamline freight operations.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Next.js | User interface and client-side logic |
| **Backend** | Express + tRPC | API layer and business logic |
| **Database** | MySQL (Drizzle ORM) | Data persistence and queries |
| **Authentication** | Manus OAuth | User authentication and authorization |
| **AI Integration** | Claude API + MCP | Intelligent quoting and recommendations |
| **Maps** | Google Maps Platform | Route optimization and geocoding |
| **Storage** | S3 | Document and file storage |
| **Real-time** | Supabase Subscriptions | Live updates and notifications |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│  React 19 + Tailwind CSS + shadcn/ui Components                │
│  ├── Quote Management UI                                        │
│  ├── Dispatch Board & Tracking                                  │
│  ├── Carrier Management                                         │
│  ├── Analytics & Reporting                                      │
│  └── Document Management                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    tRPC API GATEWAY                             │
│  ├── /api/trpc/quotes.*                                         │
│  ├── /api/trpc/dispatches.*                                     │
│  ├── /api/trpc/carriers.*                                       │
│  ├── /api/trpc/auth.*                                           │
│  └── /api/trpc/system.*                                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    ┌────────┐   ┌──────────┐   ┌─────────┐
    │ MySQL  │   │ AI Layer │   │External │
    │Database│   │(Claude)  │   │  APIs   │
    └────────┘   └──────────┘   └─────────┘
```

## Database Schema

### Core Tables

**companies** - Shippers, consignees, brokers, and carriers
- Stores company information, credentials, and contact details
- Supports multiple company types for role-based access

**carriers** - Freight carriers and transportation providers
- Includes MC/DOT numbers, service areas, equipment types
- API configuration for real-time rate integration
- Performance ratings and historical data

**quotes** - Freight pricing quotes
- Origin/destination details and container information
- Rate components and margin calculations
- AI recommendations and carrier comparisons
- Status workflow: draft → pending → accepted → expired

**dispatches** - Active shipments and shipment history
- Links quotes to actual shipments
- Tracks pickup/delivery appointments and actual times
- Financial tracking: carrier rates vs customer rates
- Status tracking with location history

**drivers** - Driver information and credentials
- License and TWIC certification tracking
- Current location and availability status
- Equipment assignments

**rate_cards** - Carrier pricing tables
- Zone-based pricing by origin/destination
- Accessorial charges and surcharges
- Effective date ranges for rate management

**accessorials** - Additional freight charges
- Detention, per diem, fuel surcharge definitions
- Flexible rate types: flat, hourly, daily, per-mile

**ai_logs** - AI interaction tracking
- Logs all Claude API calls and responses
- Token usage and response time metrics
- Input/output data for analysis

## API Endpoints

### Quotes Router
- `quotes.list()` - List all quotes with filters
- `quotes.getById(id)` - Retrieve specific quote
- `quotes.create(data)` - Create new quote with AI pricing
- `quotes.getCarrierRates(quoteId)` - Fetch multi-carrier rates
- `quotes.recommend(quoteId, priority)` - Get AI recommendation

### Dispatches Router
- `dispatches.list()` - List shipments with status filters
- `dispatches.getById(id)` - Retrieve dispatch details
- `dispatches.create(data)` - Create dispatch from quote
- `dispatches.updateStatus(id, status)` - Update shipment status
- `dispatches.board()` - Get dispatch board view

### Carriers Router
- `carriers.list()` - List all carriers
- `carriers.getById(id)` - Get carrier details
- `carriers.getRates(carrierId, origin, destination)` - Get rates
- `carriers.getPerformance(carrierId)` - Get performance metrics

### Auth Router
- `auth.me()` - Get current user
- `auth.logout()` - Logout user

## Feature Implementation Guide

### Adding a New Quote Feature

1. **Update Schema** (if needed)
   ```bash
   # Edit drizzle/schema.ts
   pnpm db:push  # Apply migrations
   ```

2. **Add Database Helper**
   ```typescript
   // In server/db.ts
   export async function getQuotesByStatus(status: string) {
     const db = await getDb();
     return await db.select().from(quotes).where(eq(quotes.status, status));
   }
   ```

3. **Create tRPC Procedure**
   ```typescript
   // In server/routers.ts
   quotes: router({
     getByStatus: publicProcedure
       .input(z.object({ status: z.string() }))
       .query(async ({ input }) => {
         return await getQuotesByStatus(input.status);
       }),
   })
   ```

4. **Build UI Component**
   ```tsx
   // In client/src/pages/QuoteList.tsx
   const { data: quotes } = trpc.quotes.getByStatus.useQuery({ status: 'pending' });
   ```

5. **Write Tests**
   ```typescript
   // In server/quotes.test.ts
   it('should fetch quotes by status', async () => {
     const quotes = await getQuotesByStatus('pending');
     expect(quotes.length).toBeGreaterThan(0);
   });
   ```

## AI Integration

### Claude API for Quote Generation

The platform uses Claude to analyze shipment details and generate intelligent pricing:

```typescript
// Example: AI-powered quote generation
const response = await invokeLLM({
  messages: [{
    role: 'system',
    content: 'You are an expert freight pricing analyst...'
  }, {
    role: 'user',
    content: `Generate quote for: ${shipmentDetails}`
  }]
});
```

### MCP (Model Context Protocol) Server

The MCP server provides Claude with direct access to freight management tools:

**Tools Available:**
- `create_freight_quote` - Create new quotes
- `get_carrier_rates` - Fetch real-time rates
- `recommend_carrier` - AI-powered carrier selection
- `create_dispatch` - Create shipments
- `update_dispatch_status` - Track shipments
- `get_gross_profit_report` - Financial analytics

## Real-time Features

### Dispatch Status Updates

Real-time subscriptions notify users of shipment changes:

```typescript
const dispatchSubscription = supabase
  .channel('dispatch-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'dispatches',
    filter: 'status=neq.delivered'
  }, (payload) => {
    // Handle update
  })
  .subscribe();
```

## Development Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Push database changes
pnpm db:push

# Build for production
pnpm build
```

### Creating a Feature

1. Update `todo.md` with feature tasks
2. Design database schema if needed
3. Create tRPC procedures
4. Build React components
5. Write vitest tests
6. Test in browser
7. Create checkpoint before pushing

### Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/quotes.test.ts

# Watch mode
pnpm test --watch
```

## Deployment

The application is deployed on Manus platform:

1. Create a checkpoint with `webdev_save_checkpoint`
2. Click the "Publish" button in the Management UI
3. Select the checkpoint to deploy
4. Monitor deployment status in the Dashboard

## Environment Variables

**System-provided (auto-injected):**
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Login portal URL
- `BUILT_IN_FORGE_API_URL` - Manus API URL
- `BUILT_IN_FORGE_API_KEY` - Manus API key

**Custom (add via Settings → Secrets):**
- `GOOGLE_MAPS_API_KEY` - For route optimization
- `CLAUDE_API_KEY` - For AI features
- `CARRIER_API_KEYS` - For carrier integrations

## Key Files

| File | Purpose |
|------|---------|
| `drizzle/schema.ts` | Database schema definitions |
| `server/db.ts` | Database query helpers |
| `server/routers.ts` | tRPC procedure definitions |
| `client/src/App.tsx` | Frontend routing and layout |
| `client/src/pages/` | Feature pages and components |
| `todo.md` | Development task tracking |

## Common Tasks

### Add a New Database Table

1. Define table in `drizzle/schema.ts`
2. Run `pnpm db:push`
3. Add query helpers in `server/db.ts`
4. Create procedures in `server/routers.ts`

### Integrate External API

1. Add credentials via Settings → Secrets
2. Create API client in `server/` directory
3. Wrap in tRPC procedure
4. Call from React components

### Create New Page

1. Create `client/src/pages/FeatureName.tsx`
2. Add route to `client/src/App.tsx`
3. Use `trpc.*.useQuery/useMutation` for data
4. Style with Tailwind + shadcn/ui

## Performance Considerations

- **Page Load:** Target < 2s with optimized images and code splitting
- **API Response:** Target < 500ms for tRPC procedures
- **Database Queries:** Use indexes on frequently filtered columns
- **Real-time Updates:** Limit subscription scope to relevant data
- **File Storage:** Use S3 for documents, keep database lean

## Security Best Practices

- All sensitive credentials stored in environment variables
- Row-level security (RLS) policies on database tables
- API rate limiting on public endpoints
- Input validation with Zod schemas
- HTTPS enforced for all connections
- OAuth for user authentication

## Next Steps

1. **Implement Quote Module** - Build full quote creation and management
2. **Build Dispatch Board** - Real-time shipment tracking interface
3. **Add Carrier Integration** - Connect to carrier APIs for rates
4. **Create Analytics Dashboard** - Profitability and performance metrics
5. **Deploy MCP Server** - Enable Claude integration for AI features

## Resources

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
