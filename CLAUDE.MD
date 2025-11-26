# FreightFlow Pro - Claude Code Guide

## Project Overview

FreightFlow Pro is an AI-powered freight quote and dispatch management platform for logistics companies. It combines intelligent pricing analysis, real-time dispatch tracking, and carrier optimization to streamline freight operations.

**Key Capabilities:**
- Intelligent freight quote generation with AI-powered pricing
- Real-time dispatch and shipment tracking
- Multi-carrier rate comparison and selection
- Document generation (BOL, invoices, packing lists)
- Performance analytics and profitability reporting
- MCP server integration for Claude AI capabilities

## Technology Stack

```
Frontend:  React 19 + Vite + Tailwind CSS + shadcn/ui
Backend:   Express + tRPC + MySQL (Drizzle ORM)
Auth:      Manus OAuth (JWT-based)
AI:        Claude API + MCP Server
Maps:      Google Maps Platform
Storage:   S3
Real-time: Supabase Subscriptions
Testing:   Vitest
```

## Project Structure

```
freightflow-pro/
├── client/              # React frontend application
│   └── src/
│       ├── pages/       # Feature pages (Home, Quotes, Dispatches, etc.)
│       ├── components/  # Reusable UI components
│       └── _core/       # Core utilities and hooks
├── server/              # Express + tRPC backend
│   ├── _core/           # Core server infrastructure (DO NOT EDIT)
│   ├── routers.ts       # tRPC API route definitions
│   ├── db.ts            # Database query helpers
│   └── storage.ts       # S3 storage utilities
├── drizzle/             # Database schema and migrations
│   ├── schema.ts        # Table definitions
│   └── relations.ts     # Table relationships
├── shared/              # Code shared between client and server
│   ├── types.ts         # Type definitions
│   └── const.ts         # Constants
├── ARCHITECTURE.md      # Detailed architecture documentation
└── todo.md              # Feature development roadmap
```

## Key Files & Their Purposes

| File | Purpose | When to Edit |
|------|---------|--------------|
| `drizzle/schema.ts` | Database table schemas | Adding/modifying database tables |
| `server/db.ts` | Database query functions | Adding new database queries |
| `server/routers.ts` | tRPC API endpoints | Creating new API endpoints |
| `client/src/App.tsx` | Frontend routing | Adding new pages/routes |
| `client/src/pages/` | Feature pages | Building UI features |
| `shared/types.ts` | TypeScript types | Defining shared types |
| `todo.md` | Development roadmap | Planning features |
| `ARCHITECTURE.md` | Detailed docs | Reference only |

**DO NOT EDIT:** Files in `server/_core/` - these are managed by the Manus platform.

## Database Architecture

The application uses MySQL via Drizzle ORM with the following core tables:

- **companies** - Shippers, consignees, brokers, carriers
- **carriers** - Freight carriers with MC/DOT, API config, ratings
- **quotes** - Freight quotes with AI recommendations
- **dispatches** - Active shipments with tracking
- **drivers** - Driver credentials and availability
- **rate_cards** - Carrier pricing tables
- **accessorials** - Additional charges (detention, fuel, etc.)
- **ai_logs** - AI interaction tracking

**Schema Location:** `drizzle/schema.ts`

## Common Development Tasks

### 1. Adding a New API Endpoint

```typescript
// 1. Add database query helper in server/db.ts
export async function getQuotesByStatus(status: string) {
  const db = await getDb();
  return await db.select().from(quotes).where(eq(quotes.status, status));
}

// 2. Add tRPC procedure in server/routers.ts
quotes: router({
  getByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await getQuotesByStatus(input.status);
    }),
})

// 3. Use in React component
const { data } = trpc.quotes.getByStatus.useQuery({ status: 'pending' });
```

### 2. Adding a Database Table

```bash
# 1. Define table in drizzle/schema.ts
# 2. Push changes to database
pnpm db:push

# 3. Add query helpers in server/db.ts
# 4. Create tRPC procedures in server/routers.ts
```

### 3. Creating a New Page

```typescript
// 1. Create client/src/pages/FeatureName.tsx
export function FeatureName() {
  const { data } = trpc.feature.list.useQuery();
  return <div>{/* UI */}</div>;
}

// 2. Add route to client/src/App.tsx
import { FeatureName } from './pages/FeatureName';

// In Routes component:
<Route path="/feature" component={FeatureName} />
```

### 4. Working with AI (Claude API)

```typescript
// Use built-in LLM helper from server/_core/llm.ts
import { invokeLLM } from './_core/llm';

const response = await invokeLLM({
  messages: [{
    role: 'system',
    content: 'You are a freight pricing expert...'
  }, {
    role: 'user',
    content: `Generate quote for: ${shipmentDetails}`
  }]
});

// Log AI interactions in ai_logs table for tracking
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (auto-reload)
pnpm dev

# Run type checking
pnpm check

# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Push database schema changes
pnpm db:push

# Format code
pnpm format

# Build for production
pnpm build

# Start production server
pnpm start
```

## Development Workflow

1. **Update `todo.md`** with feature tasks (if complex)
2. **Design database schema** changes if needed (drizzle/schema.ts)
3. **Push schema changes** with `pnpm db:push`
4. **Create database helpers** in server/db.ts
5. **Build tRPC procedures** in server/routers.ts
6. **Create React components** in client/src/pages/
7. **Write tests** in vitest
8. **Test in browser** with `pnpm dev`
9. **Commit changes** with clear messages
10. **Push to branch** specified in task

## Testing Guidelines

- **Unit Tests:** Test business logic, calculations, data transformations
- **Integration Tests:** Test tRPC procedures with database
- **E2E Tests:** Test critical user workflows
- **Test Location:** Place tests next to the code they test (e.g., `server/quotes.test.ts`)

```typescript
// Example test
import { describe, it, expect } from 'vitest';
import { calculateQuote } from './quotes';

describe('Quote Calculation', () => {
  it('should calculate total with accessorials', () => {
    const result = calculateQuote({ base: 1000, fuel: 150 });
    expect(result).toBe(1150);
  });
});
```

## Code Conventions

### General Principles
- **Prefer editing existing files** over creating new ones
- **Keep it simple** - avoid over-engineering
- **Don't add features** unless explicitly requested
- **Validate at boundaries** - user input, external APIs
- **Trust internal code** - don't add defensive checks for impossible scenarios

### TypeScript
- Use strict TypeScript with proper types
- Define shared types in `shared/types.ts`
- Use Zod for runtime validation in tRPC procedures

### React
- Use functional components with hooks
- Prefer `trpc.*.useQuery` and `trpc.*.useMutation` for data
- Use shadcn/ui components for consistent UI
- Style with Tailwind CSS utility classes

### Database
- Use Drizzle ORM query builder (not raw SQL)
- Add indexes for frequently filtered columns
- Use transactions for multi-table operations
- Always use prepared statements (built into Drizzle)

## Environment Variables

**Auto-injected by Manus platform:**
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Login portal URL
- `BUILT_IN_FORGE_API_URL` - Manus API URL
- `BUILT_IN_FORGE_API_KEY` - Manus API key

**Custom (add via Settings → Secrets):**
- `GOOGLE_MAPS_API_KEY` - For route optimization
- `CLAUDE_API_KEY` - For AI features
- `CARRIER_API_KEYS` - For carrier integrations

## Authentication

The app uses Manus OAuth (JWT-based). Current user is available via:

```typescript
// In tRPC procedures (server-side)
const user = ctx.user; // From context

// In React components (client-side)
import { useAuth } from './_core/hooks/useAuth';
const { user, isAuthenticated } = useAuth();
```

## Real-time Features

Use Supabase subscriptions for real-time updates:

```typescript
const dispatchSubscription = supabase
  .channel('dispatch-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'dispatches',
  }, (payload) => {
    // Handle update
  })
  .subscribe();
```

## Security Best Practices

- All sensitive data in environment variables
- Input validation with Zod schemas
- Rate limiting on public endpoints
- HTTPS enforced for all connections
- OAuth for authentication
- Row-level security on database tables

## Performance Targets

- **Page Load:** < 2s (optimize images, code splitting)
- **API Response:** < 500ms for tRPC procedures
- **Database Queries:** Use indexes on filtered columns
- **Real-time Updates:** Limit subscription scope
- **File Storage:** Use S3, keep database lean

## Deployment

The application runs on the Manus platform:

1. Commit and push changes to the feature branch
2. Create pull request to main branch
3. Manus auto-deploys on merge to main
4. Monitor via Manus dashboard

## MCP Server Integration

The project will include an MCP (Model Context Protocol) server that provides Claude with direct access to freight management tools:

**Available Tools (planned):**
- `create_freight_quote` - Generate quotes
- `get_carrier_rates` - Fetch real-time rates
- `recommend_carrier` - AI carrier selection
- `create_dispatch` - Create shipments
- `update_dispatch_status` - Track shipments
- `get_gross_profit_report` - Financial analytics

**Setup:** MCP server configuration will be in a separate directory (to be implemented)

## Current Development Status

**Completed:**
- Database schema with 9 core tables
- tRPC API routers for quotes, dispatches, carriers
- Database query helpers
- Authenticated home page dashboard
- Project architecture documentation

**In Progress:** (Check `todo.md` for full roadmap)
- Quote management UI
- Dispatch board interface
- Carrier integration framework
- Document generation
- Analytics dashboard

## Common Patterns

### Error Handling
```typescript
// In tRPC procedures
if (!result) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Quote not found',
  });
}
```

### Data Fetching
```typescript
// Use tRPC hooks in React
const { data, isLoading, error } = trpc.quotes.list.useQuery();

// Mutations
const mutation = trpc.quotes.create.useMutation({
  onSuccess: () => {
    // Refetch or update cache
  }
});
```

### Form Handling
```typescript
// Use react-hook-form with Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(quoteSchema),
});
```

## Debugging Tips

- Check `pnpm dev` console for server errors
- Check browser console for client errors
- Use `console.log` in development (remove before commit)
- Use Chrome DevTools React extension
- Check database with Drizzle Studio: `pnpm drizzle-kit studio`

## Getting Help

- Review `ARCHITECTURE.md` for detailed architecture
- Check `todo.md` for planned features
- Review existing code in similar features
- Check tRPC, Drizzle, and React documentation

## Important Reminders

1. **Never edit `server/_core/` files** - managed by Manus platform
2. **Always run `pnpm db:push`** after schema changes
3. **Use tRPC for all API calls** - not REST endpoints
4. **Test before committing** - run `pnpm test`
5. **Follow git branch naming** - branches must start with `claude/`
6. **Keep it simple** - avoid premature optimization
7. **Document complex logic** - but prefer self-documenting code

---

**For detailed architecture, see `ARCHITECTURE.md`**
**For feature roadmap, see `todo.md`**
