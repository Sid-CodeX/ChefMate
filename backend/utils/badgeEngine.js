const badgeUtils = require("./badgeUtils");
const eventEmitter = require("./eventEmitter");
const pool = require("../config/db");
const { incrementMealCookedCount } = require("../models/userModel");

const earnedBadgesCache = new Map();

const getEarnedBadgesForUser = async (userId) => {
  if (!earnedBadgesCache.has(userId)) {
    const res = await pool.query("SELECT badge_name FROM user_badges WHERE user_id = $1", [userId]);
    earnedBadgesCache.set(userId, new Set(res.rows.map(row => row.badge_name)));
  }
  return earnedBadgesCache.get(userId);
};

const initializeBadgeMetadata = async () => {
  console.log("[BadgeEngine] Initializing badge metadata...");
  for (const badge of badgeUtils) {
    try {
      await pool.query(
        `INSERT INTO badges (name, description, type, category, rarity, icon_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (name) DO UPDATE SET
           description = EXCLUDED.description,
           type = EXCLUDED.type,
           category = EXCLUDED.category,
           rarity = EXCLUDED.rarity,
           icon_url = EXCLUDED.icon_url`,
        [badge.name, badge.description, badge.type, badge.category, badge.rarity || 'Common', badge.icon_url || null]
      );
    } catch (err) {
      console.error(`[BadgeEngine Error] Failed to insert/update metadata for "${badge.name}":`, err);
    }
  }
  console.log("[BadgeEngine] Badge metadata initialization complete.");
};

const processBadgeEvent = async (eventType, userId) => {
  const alreadyEarned = await getEarnedBadgesForUser(userId);
  const newlyEarned = [];

  const relevantBadges = badgeUtils.filter(b =>
    b.type === eventType && b.type !== "LOGIN_ONCE"
  );

  for (const badge of relevantBadges) {
    if (!alreadyEarned.has(badge.name) && typeof badge.check === "function") {
      const earned = await badge.check(userId, pool);
      if (earned) {
        await pool.query(
          `INSERT INTO user_badges (user_id, badge_name, earned_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (user_id, badge_name) DO NOTHING`,
          [userId, badge.name]
        );
        alreadyEarned.add(badge.name);
        newlyEarned.push(badge.name);
        console.log(`[BadgeEngine] Awarded badge: "${badge.name}" to user: ${userId}`);
        eventEmitter.emit("badgeAwarded", userId, badge.name);
      }
    }
  }

  return newlyEarned;
};

const awardFirstLoginBadge = async (userId, db) => {
  try {
    await db.query(
      `INSERT INTO user_badges (user_id, badge_name, earned_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, badge_name) DO NOTHING`,
      [userId, "First Login"]
    );
    earnedBadgesCache.get(userId)?.add("First Login");
    console.log(`[BadgeEngine] Awarded badge: "First Login" to user: ${userId}`);
    return true;
  } catch (err) {
    console.error(`[BadgeEngine Error] Failed to award "First Login" badge to user ${userId}:`, err);
    return false;
  }
};

// Register event handlers
eventEmitter.on("userLoggedIn", async (userId) => {
  await processBadgeEvent("LOGIN", userId);
});

eventEmitter.on("mealCooked", async (userId, recipeId, region) => {
  await incrementMealCookedCount(userId, region);
  await processBadgeEvent("MEAL_COOKED", userId);
  await processBadgeEvent("MEAL_COOKED_DAILY", userId);
  await processBadgeEvent("MEAL_COOKED_REGION", userId);
});

eventEmitter.on("recipeFavorited", async (userId) => {
  await processBadgeEvent("RECIPE_FAVORITED", userId);
});
eventEmitter.on("chatUsed", async (userId) => {
  await processBadgeEvent("CHAT_USED", userId);
});
eventEmitter.on("rewriterUsed", async (userId) => {
  await processBadgeEvent("REWRITER_USED", userId);
});
eventEmitter.on("shoppingListGenerated", async (userId) => {
  await processBadgeEvent("SHOPPING_LIST_GENERATED", userId);
});
eventEmitter.on("dailyChallengeUpdated", async (userId) => {
  await processBadgeEvent("DAILY_CHALLENGE_STATUS_UPDATE", userId);
});

module.exports = {
  getEarnedBadgesForUser,
  processBadgeEvent,
  initializeBadgeMetadata,
  awardFirstLoginBadge
};
