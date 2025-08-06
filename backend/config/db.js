require("dotenv").config();
const { Pool } = require("pg");

// Create a new pool with SSL enabled (required for Supabase)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false, 
  },
});

module.exports = pool;
