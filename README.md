# Task Manager

A full-stack task management app with a React client, an Express API, and a PostgreSQL database. Users can sign up, sign in, reset their password, and manage their own tasks.

## Project Structure

- `client/`: React frontend
- `server/`: Express backend

## Database

The app uses PostgreSQL through the `pg` package. It works with:

- Supabase hosted PostgreSQL
- Local PostgreSQL connections through Beekeeper Studio

Do not commit real database URLs, passwords, or Supabase credentials. Keep them in `server/.env`.

## Server Environment

Create `server/.env` from `server/.env.example`.

For local PostgreSQL:

```env
PORT=5000
AUTH_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
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
PORT=5000
AUTH_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres.your_project_ref:your_password@aws-0-region.pooler.supabase.com:6543/postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

## Client Environment

Create `client/.env` from `client/.env.example` if you need a custom API URL.

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Run Locally

Install and start the server:

```bash
cd server
npm install
npm run dev
```

Install and start the client:

```bash
cd client
npm install
npm start
```

The client runs at `http://localhost:3000` and the API runs at `http://localhost:5000/api`.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the database schema SQL.
4. Copy the Supabase PostgreSQL connection string into `server/.env`.
5. Keep `DB_SSL=true`.

## Beekeeper Setup

Use Beekeeper Studio to connect to either local PostgreSQL or your Supabase database. Run the same schema SQL there if you are setting up a local database.
