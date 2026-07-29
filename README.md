# Real-Time Monitoring Dashboard

Full-stack temperature monitoring dashboard built with a Next.js frontend and an Express backend. The backend generates mock temperature readings every 5 seconds, stores them in MongoDB, exposes initial readings through REST, and broadcasts new readings with Socket.IO. The frontend server-renders the initial readings, then updates the dashboard live in the browser.

Repository: https://github.com/JevistHang2/monitoring-dashboard

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Socket.IO Client
- Backend: Node.js, Express, TypeScript, Socket.IO, node-cron
- Database: MongoDB with Mongoose

## Project Structure

```text
monitoring-dashboard/
  backend/     # Express API, MongoDB model, scheduler, Socket.IO server
  frontend/    # Next.js dashboard UI
  ROADMAP.md   # Project roadmap and implementation checklist
```

## Features

- Server-rendered initial dashboard data from `GET /api/data`
- Live updates from Socket.IO event `new-data`
- Line chart and bar chart for temperature readings
- Recent readings table with bounded display height
- Metric cards for latest temperature, last updated time, minimum, and maximum
- Stable chart Y-axis range from `1` to `100`, matching the mock data generator
- Timezone selector for Jakarta, Singapore, and Sydney
- UTC timestamps are preserved in data and converted only for display
- Connection status badge for Socket.IO state

## Local Setup

Prerequisites:

- Node.js 20 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/monitoring-dashboard
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

Run the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:3000
```

## API Contract

All main API responses use this wrapper:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};
```

Temperature readings use UTC timestamps:

```ts
type TemperatureReading = {
  created_at: string;
  value: number;
};
```

Mock temperature values are generated from `1` to `100`.

Example response from `GET /api/data`:

```json
{
  "success": true,
  "message": "Temperature readings fetched successfully",
  "code": 200,
  "data": [
    {
      "created_at": "2026-07-27T10:00:00.000Z",
      "value": 24.7
    }
  ]
}
```

## Realtime Flow

```text
backend cron job
  -> generate mock temperature reading
  -> save reading to MongoDB
  -> emit Socket.IO event: new-data
  -> frontend appends reading to dashboard state
  -> metrics, charts, and table update live
```

Socket.IO event:

```text
new-data
```

Payload:

```ts
{
  created_at: string;
  value: number;
}
```

## Timezone Strategy

The backend stores and sends timestamps as UTC ISO strings. The frontend keeps those UTC strings unchanged in state. Timezone conversion happens only when rendering labels in charts, metrics, and the readings table.

Supported display timezones:

- `Asia/Jakarta`
- `Asia/Singapore`
- `Australia/Sydney`

The frontend uses `Intl.DateTimeFormat` with IANA timezone names so Sydney daylight-saving behavior is handled by the runtime.

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run build
npm run start
npm run test
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run format:check
npm run test
```

## Testing

Backend automated tests are implemented with Vitest and Supertest.

Run backend tests:

```bash
cd backend
npm run test
```

Implemented backend test coverage:

- Mock temperature generator returns values in the configured range.
- Serialized temperature readings return UTC ISO timestamps.
- `GET /api/data` returns readings with the expected response wrapper, array, and fields.
- The `/api/data` route test mocks the data service so it does not require a live database.
- Successful generated readings are emitted through Socket.IO.
- Failed inserts are not broadcast.

Frontend automated tests are implemented with Vitest, Testing Library, and jsdom.

Run frontend tests:

```bash
cd frontend
npm run test
```

Implemented frontend test coverage:

- Temperature formatting for placeholder, decimal, and whole-number values
- Timezone formatting for Jakarta, Singapore, and Sydney
- Timezone select displays the selected timezone label
- Timezone select calls `onChange` when another timezone is selected
- Dashboard timezone display updates when the selected timezone changes
- Dashboard appends incoming Socket.IO `new-data` readings without a page reload

## Deployment

Recommended deployment targets:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

### Backend Deployment

1. Create a MongoDB Atlas cluster and copy the connection string.
2. Deploy the `backend/` directory to Railway or Render as a Node.js service.
3. Set the backend start command to:

```bash
npm run build && npm run start
```

4. Configure the backend environment variables:

Production environment variables:

Backend:

```env
PORT=4000
MONGODB_URI=your-production-mongodb-uri
FRONTEND_URL=https://monitoring-dashboard-lemon.vercel.app
NODE_ENV=production
ENABLE_GENERATOR=false
```

5. Confirm these production endpoints work:

```text
GET /health
GET /api/data
Socket.IO event: new-data
```

### Frontend Deployment

1. Deploy the `frontend/` directory to Vercel as a Next.js app.
2. Configure the frontend environment variables:

```env
NEXT_PUBLIC_API_URL=https://monitoring-dashboard-production-3460.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://monitoring-dashboard-production-3460.up.railway.app
```

3. Confirm the deployed frontend can fetch initial data and receive Socket.IO updates from the backend.

The deployed frontend is currently hosted on Vercel:

```text
https://monitoring-dashboard-lemon.vercel.app
```

The deployed backend is currently hosted on Railway:

```text
https://monitoring-dashboard-production-3460.up.railway.app
```

Set `ENABLE_GENERATOR=true` only when you want the live demo to generate new readings every 5 seconds. Keep it `false` when idle so MongoDB Atlas does not keep growing.

Deployed URLs:

```text
Frontend URL: https://monitoring-dashboard-lemon.vercel.app
Backend URL: https://monitoring-dashboard-production-3460.up.railway.app
```

## Notes

- If the backend is stopped, no mock readings are generated during that downtime.
- When the backend restarts, Socket.IO reconnects and new readings continue from that point forward.
- The frontend keeps the visible readings bounded so charts and tables do not grow forever.
