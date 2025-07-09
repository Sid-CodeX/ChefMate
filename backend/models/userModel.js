const pool = require("../config/db");

exports.findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

exports.createUser = async ({ name, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, level, xp`,
    [name, email, password]
  );
  return result.rows[0];
};

exports.findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, level, xp, streak, last_login FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

exports.updateUserName = async (id, name) => {
  const result = await pool.query(
    `UPDATE users 
     SET name = $1, updated_at = CURRENT_TIMESTAMP, updated_by = 'profile update'
     WHERE id = $2 
     RETURNING id, name, email, level, xp, streak, last_login`,
    [name, id]
  );
  return result.rows[0];
};

exports.updateUserPassword = async (id, newPassword) => {
  await pool.query(
    `UPDATE users 
     SET password = $1, updated_at = CURRENT_TIMESTAMP, updated_by = 'password change'
     WHERE id = $2`,
    [newPassword, id]
  );
};

exports.updateLoginMeta = async (userId) => {
  const now = new Date();
  const result = await pool.query("SELECT last_login, streak FROM users WHERE id = $1", [userId]);
  const { last_login, streak } = result.rows[0];

  let newStreak = streak || 0;

  if (last_login) {
    const diff = Math.floor((now - new Date(last_login)) / (1000 * 60 * 60 * 24)); 
    newStreak = diff === 1 ? newStreak + 1 : (diff > 1 ? 1 : newStreak);
  } else {
    newStreak = 1;
  }

  await pool.query(
    `UPDATE users 
     SET last_login = $1, streak = $2, updated_at = CURRENT_TIMESTAMP, updated_by = 'login'
     WHERE id = $3`,
    [now, newStreak, userId]
  );
};
