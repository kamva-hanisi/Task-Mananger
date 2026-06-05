# Task Manager

A full-stack task management app with a React client, Vercel API functions, and a Supabase PostgreSQL database. Users can sign up, sign in, reset their password, and manage their own tasks.

## Project Structure

- `client/`: React frontend
- `api/`: Vercel API functions
- `server/`: Shared backend database, controller, auth, and password utilities

## Database

The app uses PostgreSQL through the `pg` package. It works with:

- Supabase hosted PostgreSQL
- Local PostgreSQL connections through Beekeeper Studio

Do not commit real database URLs, passwords, or Supabase credentials. Keep them in local `.env` files or Vercel Environment Variables.

## Environment Variables

For Vercel deployment, add these in the Vercel dashboard:

```env
DATABASE_URL=postgresql://postgres.your_project_ref:your_password@aws-0-region.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
AUTH_SECRET=replace_this_with_a_long_random_secret
NODE_ENV=production
```

For local development with `vercel dev`, create a local `.env` file in the project root or continue using `server/.env`.

For local PostgreSQL:

```env
PORT=5000
AUTH_SECRET=replace_this_with_a_long_random_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_NAME=task_manager
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false
```

For Supabase:

```env
AUTH_SECRET=replace_this_with_a_long_random_secret
DATABASE_URL=postgresql://postgres.your_project_ref:your_password@aws-0-region.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

## Client Environment

For deployment, no client environment variable is needed. The client calls `/api` on the same Vercel website.

For old-style separate local servers only, you can create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Run Locally

Install dependencies:

```bash
npm install
cd client
npm install
```

Run the Vercel local dev server from the project root:

```bash
npm run dev
```

The app and API run together through Vercel locally.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the database schema SQL.
4. Copy the Supabase PostgreSQL connection string into Vercel Environment Variables.
5. Keep `DB_SSL=true`.

## Beekeeper Setup

Use Beekeeper Studio only as a database viewer/editor. It does not host your app.

To connect Beekeeper to Supabase, use the same Supabase Postgres connection details:

- Host: the Supabase pooler host
- Port: usually `6543`
- User: usually `postgres.your_project_ref`
- Password: your Supabase database password
- Database: usually `postgres`
- SSL: enabled
