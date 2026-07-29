# Monitoring Dashboard Backend

Express + TypeScript backend for a real-time temperature monitoring dashboard. The backend stores temperature readings in MongoDB, exposes initial data through a REST API, and broadcasts new readings with Socket.IO.

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Socket.IO
- node-cron

## Project Structure

```text
src/
  app.ts                         # Express app, middleware, root route, and route mounting
  server.ts                      # HTTP server startup, Socket.IO setup, DB connection, cron job
  config/env.ts                  # Environment variable loading
  controllers/                   # Request and response handlers
  db/connection.ts               # MongoDB connection helpers and connection events
  jobs/                          # Background scheduled jobs
  middleware/                    # Not-found and error response handlers
  models/                        # Mongoose schemas and models
  routes/                        # Express route definitions
  services/                      # App logic and database operations
  sockets/                       # Socket.IO setup and broadcast helpers
  utils/                         # Shared helpers such as API response formatting
```

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with your local MongoDB connection:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/monitoring-dashboard
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
ENABLE_GENERATOR=true
```

Do not commit `.env`.

## Scripts

Run in development mode:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

Run the built server:

```bash
npm run start
```

Tests are not implemented yet.

## API Response Format

All main API responses use this shape:

```json
{
  "success": true,
  "message": "Response message",
  "code": 200,
  "data": {}
}
```

Error responses use the same shape:

```json
{
  "success": false,
  "message": "Error message",
  "code": 500,
  "data": null
}
```

## Endpoints

### Root

```http
GET /
```

Returns basic API metadata.

### Health Check

```http
GET /health
```

Returns server health status.

### Temperature Data

```http
GET /api/data
```

Returns the latest temperature readings, ordered from oldest to newest.

Example:

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

## Realtime Events

Socket.IO is attached to the same HTTP server as Express.

### `new-data`

Emitted after a generated temperature reading is successfully saved to MongoDB.

Payload:

```json
{
  "created_at": "2026-07-27T10:00:00.000Z",
  "value": 24.7
}
```

Frontend clients should listen for this event and append the reading to local dashboard state.

## Background Job

The backend uses `node-cron` to generate one mock temperature reading every 5 seconds.

The generator only starts when this environment variable is enabled:

```env
ENABLE_GENERATOR=true
```

Set it to `false` when you want the backend to stay online without inserting new mock readings.

Flow:

```text
generate mock temperature -> save to MongoDB -> broadcast new-data
```

Mock temperature values are generated between `1` and `100`.

## Database

MongoDB stores temperature readings in a collection generated from the Mongoose `TemperatureReading` model.

Each reading has:

```ts
{
  created_at: Date;
  value: number;
}
```

Timestamps are stored as `Date` values and serialized as UTC ISO strings in API responses.
