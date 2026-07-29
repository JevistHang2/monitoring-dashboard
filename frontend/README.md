# Monitoring Dashboard Frontend

Next.js 14 frontend for the real-time temperature monitoring dashboard.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts through shadcn chart components
- Socket.IO Client

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

For production, Vercel uses:

```env
NEXT_PUBLIC_API_URL=https://monitoring-dashboard-production-3460.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://monitoring-dashboard-production-3460.up.railway.app
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The root route redirects to:

```text
http://localhost:3000/dashboard
```

## Scripts

```bash
npm run dev           # start local development server
npm run build         # create production build
npm run start         # run production build locally
npm run lint          # run Next.js ESLint checks
npm run format        # format files with Prettier
npm run format:check  # check formatting without writing
```

## Deployment

The frontend is deployed on Vercel:

```text
https://monitoring-dashboard-lemon.vercel.app
```

The deployed frontend connects to the Railway backend:

```text
https://monitoring-dashboard-production-3460.up.railway.app
```

## Frontend Structure

```text
src/
  api/          # Backend API helpers
  app/          # Next.js App Router routes and layouts
  components/   # Dashboard, layout, feedback, and shadcn UI components
  constants/    # Environment URLs, API routes, dashboard constants
  lib/          # Reusable helpers such as timezone and response handling
  types/        # TypeScript API and dashboard data contracts
```

## Data Flow

Initial data is fetched server-side in the dashboard route from:

```text
GET /api/data
```

After the page loads, the client dashboard connects to Socket.IO and listens for:

```text
new-data
```

New readings are appended to local state, then metrics, charts, and the readings table update automatically.

## Temperature Range

The mock backend generates temperature values from `1` to `100`.

The frontend keeps matching constants for chart display:

```ts
TEMPERATURE_MIN_VALUE = 1;
TEMPERATURE_MAX_VALUE = 100;
```

Both the line chart and bar chart use this range for the Y-axis domain, so the visual scale stays stable while live readings arrive.

## Timezone Display

The dashboard keeps timestamps as UTC ISO strings and formats them only for display. Supported timezones:

- `Asia/Jakarta`
- `Asia/Singapore`
- `Australia/Sydney`

## Formatting

This project uses Prettier with the Tailwind CSS plugin.

Before committing frontend changes:

```bash
npm run lint
npm run format:check
```
