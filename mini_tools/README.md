## Mini Tools Platform

This project provides a catalog of embeddable mini tools with an accompanying admin panel. The backend is an Express API backed by MongoDB; the frontend is built with Next.js.

## Requirements

- Node.js 18+
- MongoDB instance (local or hosted)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file at the project root and provide the required variables:

   ```bash
   touch .env
   ```

   Add the following keys (fill in your own values):

   - `MONGODB_URI` – connection string for your MongoDB deployment (defaults to `mongodb://127.0.0.1:27017/mini-tools` if omitted)
   - `MONGODB_DB` (optional) – override the database name used by the API
   - `PORT` (optional) – API port, defaults to `4000`
   - `NEXT_PUBLIC_API_BASE_URL` – base URL the Next.js app should use to reach the API (e.g. `http://localhost:4000`). Leave unset to use the same origin as the served frontend.

## Running locally

Start the combined Express + Next.js dev server:

```bash
npm run dev
```

The entire app (frontend, admin panel, and API) is available at
[http://localhost:4000](http://localhost:4000).

## Testing the experience

1. Visit [http://localhost:4000/admin](http://localhost:4000/admin) and create a tool.  
   The catalog page at `/` should refresh with the new entry and the API at
   `GET http://localhost:4000/api/tools` must include it in the JSON payload.
2. Open the tool detail page and verify the iframe renders from
   `http://localhost:4000/mini-tools/:slug`.
3. Update the tool in the admin panel and confirm changes propagate to both the
   catalog and the iframe.
4. Delete the tool when finished; the admin list and catalog should empty out if
   no other tools exist.

## Production build

1. Build the Next.js assets:

   ```bash
   npm run build
   ```

2. Launch the server (which now serves the built frontend and API together):

   ```bash
   npm start
   ```

   The app will default to [http://localhost:4000](http://localhost:4000) unless
   the `PORT` environment variable is set.

## API Overview

- `GET /health` – API health check
- `GET /api/tools` – list all mini tools
- `POST /api/tools` – create a new tool
- `GET /api/tools/:id` – fetch a tool by its `id`
- `PUT /api/tools/:id` – update a tool
- `DELETE /api/tools/:id` – remove a tool
- `GET /mini-tools/:iframeSlug` – render stored HTML for embedding within an iframe

All endpoints return JSON responses unless otherwise noted. See the admin panel (`/admin`) in the frontend for a graphical interface. 
