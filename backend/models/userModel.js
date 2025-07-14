// models/userModel.js

const pool = require("../config/db");

// Fetch user by email. Includes password and last_login for authentication and badge logic.
exports.findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT id, name, email, password, level, xp, streak, last_login FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

// Create a new user. Initializes created_at and sets last_login to NULL for first login detection.
exports.createUser = async ({ name, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, created_at, updated_at, last_login)
     VALUES ($1, $2, $3, NOW(), NOW(), NULL)
     RETURNING id, name, email, level, xp, last_login`,
    [name, email, password]
  );
  return result.rows[0];
};

// Fetch user by ID. Returns all badge-related columns for client-side tracking.
exports.findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, level, xp, streak, last_login,
            total_meals_cooked,
            north_indian_meals_cooked,
            south_indian_meals_cooked,
            west_indian_meals_cooked,
            east_indian_meals_cooked
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update user's name. Returns full user object including badge counters.
exports.updateUserName = async (id, name) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, updated_at = CURRENT_TIMESTAMP, updated_by = 'profile update'
     WHERE id = $2
     RETURNING id, name, email, level, xp, streak, last_login,
            total_meals_cooked,
            north_indian_meals_cooked,
            south_indian_meals_cooked,
            west_indian_meals_cooked,
            east_indian_meals_cooked`,
    [name, id]
  );
  return result.rows[0];
};

// Update user's password. Does not return a value.
exports.updateUserPassword = async (id, newPassword) => {
  await pool.query(
    `UPDATE users
     SET password = $1, updated_at = CURRENT_TIMESTAMP, updated_by = 'password change'
     WHERE id = $2`,
    [newPassword, id]
  );
};

// Update user's login streak and last_login using UTC-based day comparison.
exports.updateLoginMeta = async (userId) => {
  const now = new Date();
  const result = await pool.query("SELECT last_login, streak FROM users WHERE id = $1", [userId]);
  const { last_login, streak } = result.rows[0];

  let newStreak = streak || 0;

  if (last_login) {
    const lastLoginDate = new Date(last_login);
    const lastUTC = Date.UTC(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
    const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.floor((nowUTC - lastUTC) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
  } else {
    newStreak = 1;
  }

  await pool.query(
    `UPDATE users
     SET last_login = NOW(), streak = $1, updated_at = CURRENT_TIMESTAMP, updated_by = 'login'
     WHERE id = $2`,
    [newStreak, userId]
  );
};

// Increment total meals cooked and optionally a regional count.
// Uses pre-computed denormalized columns for efficient badge checking.
exports.incrementMealCookedCount = async (userId, region) => {
  const validRegions = ['North', 'South', 'West', 'East'];
  const lowerCaseRegion = typeof region === 'string' ? region.toLowerCase() : null;

  let query = `UPDATE users SET total_meals_cooked = COALESCE(total_meals_cooked, 0) + 1`;
  const params = [userId];

  if (lowerCaseRegion && validRegions.includes(region)) {
    const regionColumn = `${lowerCaseRegion.replace(' ', '_')}_indian_meals_cooked`;
    query += `, ${regionColumn} = COALESCE(${regionColumn}, 0) + 1`;
  }

  query += ` WHERE id = $1`;

  try {
    await pool.query(query, params);
  } catch (err) {
    console.error(`Error incrementing meal cooked counts for user ${userId}, region ${region}:`, err);
    throw err;
  }
};
