const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const isProduction = process.env.NODE_ENV === "production";
const ssl =
  process.env.DB_SSL === "true" || (isProduction && process.env.DB_SSL !== "false")
    ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
      }
    : false;

const db = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "task_manager",
        ssl,
      },
);

db.query("SELECT NOW()")
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = db;
