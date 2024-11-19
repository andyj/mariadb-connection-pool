// db.js
require('dotenv').config(); // Load environment variables

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,         // Use DB_HOST environment variable from .env
  user: process.env.DB_USER,         // Use DB_USER environment variable from .env
  password: process.env.DB_PASSWORD, // Use DB_PASSWORD environment variable from .env
  database: process.env.DB_NAME,     // Use DB_NAME environment variable from .env
  port: process.env.DB_PORT,     // Use DB_PORT environment variable from .env
  connectionLimit: 10                // Maximum number of connections in the pool
});

module.exports = pool;