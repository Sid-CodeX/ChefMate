// XP thresholds can be exponential or linear
const XP_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1050, 1400]; // Level 1–8

function calculateLevelFromXP(xp) {
  let level = 1;
  for (let i = 1; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

async function addXPToUser(userId, xpToAdd, db) {
  const user = await db.query("SELECT xp FROM users WHERE id = $1", [userId]);
  const currentXP = user.rows[0]?.xp || 0;
  const newXP = currentXP + xpToAdd;
  const newLevel = calculateLevelFromXP(newXP);

  await db.query(
    "UPDATE users SET xp = $1, level = $2 WHERE id = $3",
    [newXP, newLevel, userId]
  );

  return { xp: newXP, level: newLevel };
}

module.exports = { addXPToUser };
