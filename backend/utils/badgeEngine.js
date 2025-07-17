// utils/badgeEngine.js
const badgeUtils = require("./badgeUtils");
const eventEmitter = require("./eventEmitter");
const pool = require("../config/db");
const { incrementMealCookedCount } = require("../models/userModel");
const { addXPToUser } = require("./xpUtils"); // <--- NEW: Import addXPToUser from xpUtils

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
        `INSERT INTO badges (name, description, type, category, rarity, icon_url, xp_reward)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (name) DO UPDATE SET
           description = EXCLUDED.description,
           type = EXCLUDED.type,
           category = EXCLUDED.category,
           rarity = EXCLUDED.rarity,
           icon_url = EXCLUDED.icon_url,
           xp_reward = EXCLUDED.xp_reward`, // <--- Make sure xp_reward is updated here
        [
          badge.name,
          badge.description,
          badge.type,
          badge.category,
          badge.rarity || 'Common', // Default rarity if not specified
          badge.icon_url || null, // Default icon_url if not specified
          badge.xpReward || 0 // Default xpReward if not specified
        ]
      );
    } catch (err) {
      console.error(`[BadgeEngine Error] Failed to insert/update metadata for "${badge.name}":`, err);
    }
  }
  console.log("[BadgeEngine] Badge metadata initialization complete.");
};

// Removed calculateLevelFromXP and awardXP functions from here.
// They are now in utils/xpUtils.js

const processBadgeEvent = async (eventType, userId) => {
  const alreadyEarned = await getEarnedBadgesForUser(userId);
  const newlyEarned = [];

  // Filter for badges that match the event type and are not the "First Login" one-time badge
  const relevantBadges = badgeUtils.filter(b =>
    b.type === eventType && b.type !== "LOGIN_ONCE"
  );

  for (const badge of relevantBadges) {
    // Only check if the badge hasn't been earned yet and has a check function
    if (!alreadyEarned.has(badge.name) && typeof badge.check === "function") {
      const earned = await badge.check(userId, pool); // Pass pool to the check function
      if (earned) {
        // Award the badge
        await pool.query(
          `INSERT INTO user_badges (user_id, badge_name, earned_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (user_id, badge_name) DO NOTHING`,
          [userId, badge.name]
        );
        alreadyEarned.add(badge.name); // Update cache
        newlyEarned.push(badge.name);
        console.log(`[BadgeEngine] Awarded badge: "${badge.name}" to user: ${userId}`);

        // 🎉 Award XP if defined for this badge, using the centralized XP utility
        if (badge.xpReward) {
          await addXPToUser(userId, badge.xpReward, pool); // <--- CHANGE: Using addXPToUser
          console.log(`[BadgeEngine] Added ${badge.xpReward} XP to user: ${userId}`);
        }

        eventEmitter.emit("badgeAwarded", userId, badge.name);
      }
    }
  }
  return newlyEarned;
};

const awardFirstLoginBadge = async (userId, db) => {
  try {
    // Attempt to award "First Login" badge
    await db.query(
      `INSERT INTO user_badges (user_id, badge_name, earned_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, badge_name) DO NOTHING`,
      [userId, "First Login"]
    );
    // Update cache if successful or on conflict (it's now considered earned)
    earnedBadgesCache.get(userId)?.add("First Login");
    console.log(`[BadgeEngine] Awarded badge: "First Login" to user: ${userId}`);

    // Optional: Add XP for First Login badge if defined in badgeUtils
    const firstLoginBadge = badgeUtils.find(b => b.name === "First Login");
    if (firstLoginBadge?.xpReward) {
      await addXPToUser(userId, firstLoginBadge.xpReward, pool); // <--- CHANGE: Using addXPToUser
      console.log(`[BadgeEngine] Added ${firstLoginBadge.xpReward} XP to user: ${userId}`);
    }

    return true;
  } catch (err) {
    console.error(`[BadgeEngine Error] Failed to award "First Login" badge to user ${userId}:`, err);
    return false;
  }
};

// 🔔 Register event listeners
eventEmitter.on("userLoggedIn", async (userId) => {
  try {
    await processBadgeEvent("LOGIN", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing userLoggedIn event for user ${userId}:`, err);
  }
});

eventEmitter.on("mealCooked", async (userId, recipeId, region) => {
  try {
    await incrementMealCookedCount(userId, region);
    await processBadgeEvent("MEAL_COOKED", userId);
    await processBadgeEvent("MEAL_COOKED_DAILY", userId);
    await processBadgeEvent("MEAL_COOKED_REGION", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing mealCooked event for user ${userId}:`, err);
  }
});

eventEmitter.on("recipeFavorited", async (userId) => {
  try {
    await processBadgeEvent("RECIPE_FAVORITED", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing recipeFavorited event for user ${userId}:`, err);
  }
});

eventEmitter.on("chatUsed", async (userId) => {
  try {
    await processBadgeEvent("CHAT_USED", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing chatUsed event for user ${userId}:`, err);
  }
});

eventEmitter.on("rewriterUsed", async (userId) => {
  try {
    await processBadgeEvent("REWRITER_USED", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing rewriterUsed event for user ${userId}:`, err);
  }
});

eventEmitter.on("shoppingListGenerated", async (userId) => {
  try {
    await processBadgeEvent("SHOPPING_LIST_GENERATED", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing shoppingListGenerated event for user ${userId}:`, err);
  }
});

eventEmitter.on("dailyChallengeUpdated", async (userId) => {
  try {
    await processBadgeEvent("DAILY_CHALLENGE_STATUS_UPDATE", userId);
  } catch (err) {
    console.error(`[BadgeEngine Error] Error processing dailyChallengeUpdated event for user ${userId}:`, err);
  }
});

module.exports = {
  getEarnedBadgesForUser,
  processBadgeEvent,
  initializeBadgeMetadata,
  awardFirstLoginBadge
};