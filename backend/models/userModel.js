const pool = require("../config/db");

// Find a user by email
exports.findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// Create a new user
exports.createUser = async ({ name, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, level, xp`,
    [name, email, password]
  );
  return result.rows[0];
};

// Optionally: Get user by ID (for /me route later)
exports.findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, level, xp FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};
