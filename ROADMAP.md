# Real-Time Monitoring Dashboard Roadmap

This roadmap tracks the implementation plan and completion status for the real-time temperature monitoring dashboard.

## Target architecture

```text
MongoDB Atlas
    ^
    | Mongoose
Express + Socket.IO backend
    | /api/data (initial data)
    | new-data WebSocket event
    v
Next.js 14 frontend
    | Server Component: initial SSR fetch
    | Client Component: Socket.IO + timezone selection + charts
```

Recommended deployment:

- Frontend: Vercel
- Backend: Render or Railway with a persistent Node process and WebSocket support
- Database: MongoDB Atlas

## Phase 0 - Project setup

- [x] Create a root README and document the frontend/backend structure.
- [x] Keep separate applications: `frontend/` and `backend/`.
- [x] Add `.gitignore` files and environment variable templates.
- [x] Decide the API URL and Socket.IO URL configuration for local and production environments.
- [x] Create meaningful commits by feature.

Suggested structure:

```text
frontend/
backend/
README.md
```

## Phase 1 - Backend foundation

### Dependencies

- [x] Add `cors`, `dotenv`, `mongoose`, `socket.io`, and a scheduler such as `node-cron`.
- [x] Add TypeScript tooling: `typescript`, `tsx`, `@types/node`, `@types/express`, and `@types/cors`.
- [x] Add a backend test stack with Vitest, Supertest, and TypeScript test support.
- [x] Add development scripts for `dev`, `build`, and `start`.
- [x] Replace the placeholder `test` script after adding the backend test stack.
- [x] Create a strict `tsconfig.json` with an output directory such as `dist/`.

### Server and configuration

- [x] Create an Express app and attach Socket.IO to the same HTTP server.
- [x] Add environment variables: `PORT`, `MONGODB_URI`, `FRONTEND_URL`, and `NODE_ENV`.
- [x] Configure CORS for the frontend origin.
- [x] Add `GET /health` for deployment checks.
- [x] Add centralized error handling and graceful database/server shutdown.
- [x] Add MongoDB connection event logging for connected, disconnected, reconnected, and error states.

### Data model

- [x] Create a `TemperatureReading` model with:
  - `created_at`: required UTC date
  - `value`: required numeric value
- [x] Add an index on `created_at`.
- [x] Store timestamps as database `Date` values; serialize them as ISO strings with `Z` in API responses.

## Phase 2 - Backend functionality

### Recommended backend structure

Use a layered structure so HTTP routes, database access, mock generation, and Socket.IO behavior remain independently testable:

```text
backend/
+-- src/
|   +-- app.ts                    # Express app, middleware, and routes
|   +-- server.ts                 # HTTP server, Socket.IO, DB startup, scheduler startup
|   +-- config/
|   |   +-- env.ts                # Validated environment variables
|   +-- db/
|   |   +-- connection.ts         # MongoDB connection and disconnect helpers
|   +-- models/
|   |   +-- temperature-reading.model.ts # Mongoose schema for created_at and value
|   +-- controllers/
|   |   +-- temperature-data.controller.ts # Request/response logic for /api/data
|   |   +-- health.controller.ts  # Request/response logic for /health
|   +-- services/
|   |   +-- temperature-reading.service.ts # Database queries and insert workflow
|   |   +-- mock-temperature.service.ts # Creates a valid UTC reading
|   +-- routes/
|   |   +-- temperature-data.routes.ts # /api/data route definitions
|   |   +-- health.routes.ts      # /health route definitions
|   +-- sockets/
|   |   +-- socket.ts             # Socket.IO connection setup and event helpers
|   +-- jobs/
|   |   +-- generate-temperature-reading.job.ts # Every-5-second generation job
|   +-- middleware/
|   |   +-- error-handler.ts      # Centralized API errors
|   |   +-- not-found.ts          # Unknown-route response
|   +-- utils/
|       +-- api-response.ts       # Consistent success/error API response wrapper
|       +-- serialize-temperature-reading.ts # Converts DB documents to API-safe JSON
+-- tests/
|   +-- unit/
|   |   +-- mock-temperature.service.test.ts
|   |   +-- serialize-reading.test.ts
|   +-- integration/
|   |   +-- temperature-data.routes.test.ts
|   +-- helpers/
|       +-- test-app.ts
+-- .env.example
+-- tsconfig.json
+-- package.json
+-- README.md
```

### Backend file responsibilities

| Area | Responsibility |
| --- | --- |
| `app.ts` | Configure Express, JSON parsing, CORS, routes, and error middleware. Do not start the server here. |
| `server.ts` | Create the HTTP server, attach Socket.IO, connect to MongoDB, start the 5-second job, and handle shutdown. |
| `models/` | Define the database schema and indexes. Models should not know about HTTP or Socket.IO. |
| `services/` | Hold reusable business and database operations. This is where insert/query logic belongs. |
| `controllers/` | Translate an HTTP request into a service call and send the HTTP response. |
| `routes/` | Map HTTP methods and URLs to controllers. |
| `sockets/` | Manage connected clients and expose a small broadcast helper for new readings. |
| `jobs/` | Schedule work and call the mock-temperature and temperature-reading services. Keep scheduling separate from generation logic. |
| `middleware/` | Handle unknown routes, validation errors, and unexpected failures consistently. |
| `tests/` | Test pure functions separately from API/database integration behavior. |

### Backend request and event flow

For `GET /api/data`:

```text
request -> temperature-data.routes.ts -> temperature-data.controller.ts
        -> temperature-reading.service.ts -> temperature-reading.model.ts -> MongoDB
        -> serialize-temperature-reading.js -> JSON response
```

For the real-time job:

```text
generate-temperature-reading.job.ts
        -> mock-temperature.service.ts
        -> temperature-reading.service.ts insert
        -> sockets/socket.ts broadcast('new-data', reading)
```

### Backend implementation sequence

1. [x] Create `config/env.ts`, `db/connection.ts`, and `models/temperature-reading.model.ts`.
2. [x] Create `app.ts` with CORS, JSON parsing, `/health`, and error middleware.
3. [x] Implement `temperature-reading.service.ts`, `temperature-data.controller.ts`, and `temperature-data.routes.ts`.
4. [x] Create `server.ts` and verify the API can connect to MongoDB.
5. [x] Implement `mock-temperature.service.ts`.
6. [x] Implement `socket.ts` and the `generate-temperature-reading.job.ts` scheduler.
7. [x] Connect the job to the database insert, then broadcast only after a successful insert.
8. [x] Add route tests without starting the real server or scheduler.

### Important separation rules

- `app.ts` should be importable by tests without opening a port or starting a scheduler.
- `server.ts` should be the only file that starts the network listener and background job.
- The mock generator should be deterministic when its random function is mocked in tests.
- Services should return data or throw errors; controllers should decide HTTP status codes.
- Socket.IO should broadcast the saved/serialized record, not an unsaved object.
- Keep UTC handling in the backend and defer timezone conversion to the frontend display layer.

### Initial data API

- [x] Implement `GET /api/data`.
- [x] Return readings ordered by `created_at` for chart-friendly display.
- [x] Add a reasonable limit, currently the latest 50 records.
- [x] Return a consistent response shape and useful error status codes.

Example response:

```json
{
  "success": true,
  "message": "Temperature readings fetched successfully",
  "code": 200,
  "data": [{ "created_at": "2024-10-21T09:00:00.000Z", "value": 72 }]
}
```

### Mock generator and real-time broadcast

- [x] Implement a pure generator that returns a numeric temperature value from `1` to `100`.
- [x] Generate timestamps with `new Date()` and serialize them as UTC ISO strings.
- [x] Run the job every 5 seconds.
- [x] Insert the generated reading into MongoDB first.
- [x] Broadcast the inserted reading with Socket.IO event `new-data` only after the insert succeeds.
- [x] Ensure all connected clients receive the same reading.
- [x] Make the scheduler start once when the server starts and stop during shutdown.

Data flow to verify:

```text
generate -> insert into DB -> emit `new-data` -> update connected dashboards
```

## Phase 3 - Frontend foundation

- [x] Create a Next.js 14 app using the App Router and TypeScript.
- [x] Enable strict TypeScript settings and avoid `any` in application code.
- [x] Add Tailwind CSS and shadcn/ui.
- [x] Add the shadcn chart components and Recharts.
- [x] Add `socket.io-client` for live backend updates.
- [x] Use `Intl.DateTimeFormat` for timezone conversion.
- [x] Create `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` in `.env.local` and `.env.example`.
- [x] Keep API and Socket.IO URLs configurable separately for deployment, even though both point to `http://localhost:4000` locally.
- [x] Add Prettier and `prettier-plugin-tailwindcss` for consistent formatting.

Implemented frontend structure:

```text
frontend/
+-- src/
|   +-- api/
|   |   +-- temperature-api.ts                # Fetches initial temperature readings
|   +-- app/
|   |   +-- layout.tsx                        # Root HTML/body/fonts/global CSS
|   |   +-- page.tsx                          # Redirects / to /dashboard
|   |   +-- not-found.tsx                     # Root 404 page without app shell
|   |   +-- (main)/
|   |       +-- layout.tsx                    # AppShell route group layout
|   |       +-- loading.tsx
|   |       +-- error.tsx
|   |       +-- dashboard/
|   |           +-- page.tsx                  # Server Component: initial SSR fetch
|   +-- components/
|   |   +-- dashboard/
|   |   |   +-- dashboard-template.tsx        # Responsive dashboard slots
|   |   |   +-- temperature-dashboard.tsx     # Client state, Socket.IO, timezone selection
|   |   |   +-- temperature-line-chart.tsx    # Realtime line chart
|   |   |   +-- temperature-bar-chart.tsx     # Realtime bar chart
|   |   |   +-- readings-table.tsx            # Bounded recent readings table
|   |   |   +-- timezone-select.tsx           # Jakarta/Singapore/Sydney selector
|   |   |   +-- connection-status.tsx         # Connected/disconnected/reconnecting display
|   |   |   +-- metric-card.tsx               # Latest/last-updated/min/max cards
|   |   +-- feedback/
|   |   |   +-- empty-state.tsx
|   |   |   +-- error-state.tsx
|   |   |   +-- loading-state.tsx
|   |   +-- layout/
|   |   |   +-- app-shell.tsx
|   |   |   +-- app-header.tsx
|   |   |   +-- app-footer.tsx
|   |   |   +-- page-container.tsx
|   |   +-- ui/                               # shadcn/ui components
|   +-- constants/
|   |   +-- api-routes.ts
|   |   +-- env.ts
|   |   +-- temperature-constant.ts
|   +-- lib/
|   |   +-- handle-api-response.ts            # Fetch response wrapper handling
|   |   +-- socket.ts                         # Typed Socket.IO client setup
|   |   +-- timezone.ts                       # UTC-to-display formatting helpers
|   |   +-- temperature-format.ts             # Temperature display formatting
|   |   +-- utils.ts                          # shadcn utility helpers
|   +-- types/
|   |   +-- api.ts                            # ApiResponse<T>
|       +-- temperature.ts                    # Reading, timezone, socket event types
+-- .env.example
+-- .env.local
+-- package.json
+-- README.md
```

### Frontend environment variables

Local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

Production:

```env
NEXT_PUBLIC_API_URL=https://monitoring-dashboard-production-3460.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://monitoring-dashboard-production-3460.up.railway.app
```

The backend must set `FRONTEND_URL=https://monitoring-dashboard-lemon.vercel.app` so Express CORS and Socket.IO CORS allow the browser connection.

### Shared data types

- [x] Define a `TemperatureReading` type in the frontend that mirrors the backend serialized response:

```ts
export type TemperatureReading = {
  created_at: string;
  value: number;
};
```

- [x] Define a generic `ApiResponse<T>` type matching the backend wrapper:

```ts
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};
```

- [x] Type the Socket.IO event map so `new-data` receives a `TemperatureReading`.
- [ ] Optional future improvement: if the API contract grows, consider a shared `packages/types` workspace package.
- [x] Otherwise, keep mirrored types and document that the backend API response is the source of truth.

## Phase 4 - Frontend dashboard

### Initial SSR load

- [x] Fetch `${NEXT_PUBLIC_API_URL}/api/data` from `src/app/(main)/dashboard/page.tsx`.
- [x] Unwrap the backend API response and pass only `data` into the client dashboard.
- [x] Pass the initial readings into a client dashboard component.
- [x] Add loading, empty, not-found, and API error states.
- [x] Keep the page useful when the backend is temporarily unavailable by rendering the dashboard with an initial-load notice.

### Real-time updates

- [x] Connect to Socket.IO when the dashboard client component mounts.
- [x] Connect to `${NEXT_PUBLIC_SOCKET_URL}`.
- [x] Listen for the backend `new-data` event.
- [x] Append each new reading to local state.
- [x] Keep a bounded list, currently the latest 50 readings, so charts do not grow forever.
- [x] Remove the socket listener and disconnect on unmount.
- [x] Display connection status such as Connected, Disconnected, or Reconnecting.
- [x] Avoid mutating `created_at`; store the UTC ISO string exactly as received.

### UI and charts

- [x] Display a responsive dashboard using shadcn/ui cards, table, select, badge, alert, and chart components.
- [x] Show summary metrics for latest temperature, last updated timestamp, minimum, and maximum.
- [x] Show a line chart and a bar chart.
- [x] Plot timestamps on the X-axis and temperature/value on the Y-axis.
- [x] Use shared frontend temperature range constants of `1` to `100` for chart Y-axis domains, matching the backend mock generator.
- [x] Label chart axes clearly:
  - X-axis: `Time (5-second intervals)`
  - Y-axis: `Temperature (°C)`
- [x] Display a readable recent-data list/table.
- [x] Add responsive behavior for mobile and desktop widths.
- [x] Add empty states for no readings and compact formatting for small screens.
- [x] Verify the app shell and dashboard across common viewports: 360, 414, 768, 1366, 1440, and 1920 widths.

## Phase 5 - Timezone behavior

- [x] Store and transmit every timestamp in UTC.
- [x] Add exactly these selectable timezones:
  - `Asia/Jakarta` - Indonesia/Jakarta
  - `Asia/Singapore` - Singapore
  - `Australia/Sydney` - Australia/Sydney
- [x] Convert timestamps only at presentation time.
- [x] Recompute chart labels when the selected timezone changes; do not reload the page.
- [x] Preserve the underlying UTC timestamp so changing timezone does not mutate data.
- [x] Handle daylight-saving changes for Sydney through IANA timezone support.
- [x] Use a shared formatter helper so charts and table rows display timestamps consistently.

## Phase 6 - Testing

### Backend tests

- [x] Test the generator returns a numeric value in the configured range.
- [x] Test serialized readings return `created_at` as a valid UTC ISO timestamp.
- [x] Test `GET /api/data` returns the expected response wrapper, array, and fields.
- [x] Mock the data service in route tests to avoid requiring a live database.
- [x] Extract the temperature generation job body for easier testing.
- [x] Test that a successfully inserted reading is emitted as `new-data`.
- [x] Test that failed inserts are not broadcast.

### Frontend tests

- [x] Test temperature formatting for placeholder, decimal, and whole-number values.
- [x] Test timezone formatting for Jakarta, Singapore, and Sydney.
- [x] Test timezone select renders the selected display label.
- [x] Test timezone select calls `onChange` when another timezone is selected.
- [x] Test changing timezone updates chart/table display without a page reload.
- [x] Test an incoming `new-data` event appends a reading to the dashboard.

- [x] Make backend tests runnable with `npm run test`.
- [x] Make current frontend tests runnable with `npm run test`.
- [x] Add test instructions and tool choices to the README.

## Phase 7 - Deployment

- [x] Create the MongoDB Atlas database and production connection string.
- [x] Deploy the backend to a provider that supports long-running WebSocket connections.
- [x] Configure backend production environment variables and MongoDB network access.
- [x] Verify the backend health endpoint, `/api/data`, database inserts, and Socket.IO events.
- [x] Deploy the frontend to Vercel or another Next.js-compatible provider.
- [x] Configure the frontend with the deployed backend URL.
- [x] Verify CORS and Socket.IO origin settings in production.
- [x] Open the public frontend in two browser windows and confirm both receive the same updates.

Deployment note:

- Frontend is deployed on Vercel at `https://monitoring-dashboard-lemon.vercel.app`.
- Backend is deployed on Railway at `https://monitoring-dashboard-production-3460.up.railway.app`.
- `ENABLE_GENERATOR` can be set to `false` while idle to keep the backend online without continuously inserting mock readings into MongoDB Atlas.
- MongoDB Atlas is configured for the `monitoring-dashboard` database. Local development used the standard `mongodb://` seed-list connection string because the local Node.js DNS resolver could not resolve the Atlas `mongodb+srv://` SRV record. Hosted backend environments can try the Atlas `mongodb+srv://` URI first and fall back to the seed-list URI if needed.

## Phase 8 - Submission polish

- [x] Add local setup instructions for both applications.
- [x] Add database setup instructions without committing secrets.
- [x] Add development, lint, format, build, and deployment command notes.
- [x] Add the public frontend URL.
- [x] Add the public backend URL.
- [x] Explain the approach, timezone strategy, assumptions, and challenges.
- [ ] Optional submission polish: add screenshots or a short demo GIF if useful.
- [x] Confirm the repository contains frontend, backend, README, roadmap, deployment notes, and tests.

## Suggested implementation order

1. Backend server, database model, and `/api/data`.
2. Mock generator, 5-second scheduler, and Socket.IO broadcast.
3. Frontend scaffold and SSR initial fetch.
4. Client dashboard, charts, and data table.
5. Socket.IO client updates.
6. Timezone selection and conversion.
7. Automated tests.
8. Deployment and production verification.
9. README and submission cleanup.

## Definition of done

The project is complete when a reviewer can open the public frontend, see initial database data, switch between the three timezones, watch new readings appear every 5 seconds in both charts without refreshing, and find working tests plus setup/deployment instructions in the GitHub repository.
