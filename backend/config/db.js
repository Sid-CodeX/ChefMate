// config/db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Optional test log
pool.connect()
  .then(() => console.log(" PostgreSQL Connected"))
  .catch((err) => {
    console.error(" PostgreSQL Connection Error:", err);
    process.exit(1);
  });

module.exports = pool;
