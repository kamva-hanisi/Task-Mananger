# Task Manager

A full-stack task management app with a React client, Vercel API functions, and a Neon PostgreSQL database. Users can sign up, sign in, reset their password, and manage their own tasks.

## Project Structure

- `client/`: React frontend
- `api/`: Vercel API functions
- `server/`: Shared backend database, controller, auth, and password utilities
- `database/schema.sql`: PostgreSQL schema for Neon

## Database

The app uses PostgreSQL through the `pg` package. It works with:

- Neon hosted PostgreSQL
- Local PostgreSQL connections through Beekeeper Studio

Do not commit real database URLs, passwords, or Neon credentials. Keep them in local `.env` files or Vercel Environment Variables.

## Environment Variables

For Vercel deployment, add these in the Vercel dashboard:

```env
DATABASE_URL=postgresql://user:password@ep-example-pooler.region.aws.neon.tech/dbname?sslmode=require
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
AUTH_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=https://your-github-username.github.io
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

For Neon:

```env
AUTH_SECRET=replace_this_with_a_long_random_secret
DATABASE_URL=postgresql://user:password@ep-example-pooler.region.aws.neon.tech/dbname?sslmode=require
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
```

## Client Environment

For GitHub Pages deployment, add this repository secret in GitHub:

```env
REACT_APP_API_URL=https://your-task-manager-api.vercel.app/api
```

For local Vercel development, no client environment variable is needed. The client calls `/api` on the same Vercel website.

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

## Neon Setup

1. Create a Neon project.
2. Open the Neon SQL Editor.
3. Run `database/schema.sql`.
4. Copy the Neon pooled PostgreSQL connection string into Vercel Environment Variables.
5. Keep `DB_SSL=true`.

## Beekeeper Setup

Use Beekeeper Studio only as a database viewer/editor. It does not host your app.

To connect Beekeeper to Neon, use the same Neon Postgres connection details:

- Host: the Neon pooler host
- Port: usually `5432`
- User: your Neon database user
- Password: your Neon database password
- Database: your Neon database name
- SSL: enabled

## GitHub Pages Setup

1. Push the repository to GitHub.
2. Go to Settings > Pages.
3. Set Source to GitHub Actions.
4. Add a repository secret named `REACT_APP_API_URL` with your Vercel API URL.
5. Push to `main`; the workflow deploys `client/build`.
