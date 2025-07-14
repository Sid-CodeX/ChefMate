const pool = require("../config/db");

// Get badges the logged-in user has earned
exports.getUserBadges = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ub.badge_name, ub.earned_at,
              b.description, b.type, b.category, b.rarity, b.icon_url
       FROM user_badges ub
       JOIN badges b ON ub.badge_name = b.name
       WHERE ub.user_id = $1
       ORDER BY ub.earned_at DESC`,
      [req.user.id]
    );
    res.status(200).json({ badges: result.rows });
  } catch (err) {
    console.error("[BadgeController] Error fetching user badges:", err);
    res.status(500).json({ message: "Failed to retrieve user badges." });
  }
};

// Get all badge definitions (metadata)
exports.getAllBadgeMetadata = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT name, description, type, category, rarity, icon_url FROM badges ORDER BY name`
    );
    res.status(200).json({ badges: result.rows });
  } catch (err) {
    console.error("[BadgeController] Error fetching badge metadata:", err);
    res.status(500).json({ message: "Failed to retrieve badge metadata." });
  }
};
