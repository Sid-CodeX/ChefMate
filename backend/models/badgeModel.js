const pool = require("../config/db");

// Utility: Check if user has a specific badge
exports.hasBadge = async (userId, badgeName) => {
  const res = await pool.query(
    `SELECT 1 FROM user_badges WHERE user_id = $1 AND badge_name = $2`,
    [userId, badgeName]
  );
  return res.rowCount > 0;
};

// Utility: Manually award a badge (e.g. admin)
exports.awardBadge = async (userId, badgeName) => {
  await pool.query(
    `INSERT INTO user_badges (user_id, badge_name)
     VALUES ($1, $2)
     ON CONFLICT (user_id, badge_name) DO NOTHING`,
    [userId, badgeName]
  );
};

// Internal: Get raw badges (used internally)
exports.getUserBadges = async (userId) => {
  const res = await pool.query(
    `SELECT badge_name, earned_at FROM user_badges WHERE user_id = $1`,
    [userId]
  );
  return res.rows;
};
