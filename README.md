# Task Manager

A full-stack task management application built to help users create, organize, update, and track tasks through a clean React interface and a Node.js/Express backend. The project demonstrates CRUD operations, REST API design, frontend state management, backend routing, environment-based configuration, and database integration.

## Folder structure

- `client/`: React frontend
- `server/`: Express backend

## Backend setup

1. Open a terminal in `server/`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update your MySQL credentials
4. Initialize the database:
   - Run the SQL in `server/db-init.sql`
   - Or use your MySQL client to create the `tasks` database and `tasks` table
5. Start the server:
   - `npm run dev` (development)
   - `npm start` (production)

The backend listens on `PORT` from `.env`, or `5000` by default.

## Frontend setup

1. Open a terminal in `client/`
2. Install dependencies: `npm install`
3. Copy `client/.env.example` to `client/.env` if you need a custom API URL
4. Start the app: `npm start`

## GitHub Pages deployment

To deploy the frontend to GitHub Pages:

1. To deploy the project, use **Render**
2. The app will be published at `https://task-mananger-client.onrender.com`

> Note: GitHub Pages only serves the React frontend. The backend must be hosted separately on a Node-compatible service.

## Deployment notes

- The frontend reads `REACT_APP_API_URL` if set; otherwise it uses `http://localhost:5000/api`
- Use `npm run build` in `client/` to create a production bundle
- The backend now has a `start` script and uses `PORT || 5000`

## Database initialization

The SQL file `server/db-init.sql` creates the `tasks` database and the required `tasks` table.
