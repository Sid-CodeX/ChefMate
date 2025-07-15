const badgeUtils = [
  // Daily Badges (5 XP)
  {
    name: "Daily Login",
    description: "Logged in today",
    type: "LOGIN",
    category: "Daily",
    xpReward: 5,
    async check(userId, db) {
      const res = await db.query("SELECT last_login FROM users WHERE id = $1", [userId]);
      const lastLoginDate = new Date(res.rows[0]?.last_login).toISOString().slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);
      return lastLoginDate === today;
    },
  },
  {
    name: "Meal Cooked Today",
    description: "Cooked a meal today",
    type: "MEAL_COOKED_DAILY",
    category: "Daily",
    xpReward: 5,
    async check(userId, db) {
      const today = new Date().toISOString().slice(0, 10);
      const res = await db.query(
        `SELECT 1 FROM cooking_logs WHERE user_id = $1 AND DATE(cooked_at) = $2 LIMIT 1`,
        [userId, today]
      );
      return res.rowCount > 0;
    },
  },
  {
    name: "Challenge Completed",
    description: "Completed today's daily challenge",
    type: "DAILY_CHALLENGE_STATUS_UPDATE",
    category: "Daily",
    xpReward: 5,
    async check(userId, db) {
      const today = new Date().toISOString().slice(0, 10);
      const res = await db.query(
        "SELECT cooked_meal, planned_meal, logged_in FROM daily_challenges WHERE user_id = $1 AND date = $2",
        [userId, today]
      );
      const ch = res.rows[0];
      return ch?.cooked_meal && ch?.planned_meal && ch?.logged_in;
    },
  },
  {
    name: "Streak Starter",
    description: "Achieved a login streak of 3 days",
    type: "LOGIN",
    category: "Milestone",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT streak FROM users WHERE id = $1", [userId]);
      return parseInt(res.rows[0]?.streak || 0) >= 3;
    }
  },

  // Feature Usage (10 XP)
  {
    name: "First Favorite",
    description: "Added your first recipe to favorites",
    type: "RECIPE_FAVORITED",
    category: "Feature Usage",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT COUNT(*) FROM favorites WHERE user_id = $1", [userId]);
      return parseInt(res.rows[0].count) >= 1;
    },
  },
  {
    name: "Used Cooking Mode",
    description: "Cooked your first meal using the app's cooking mode",
    type: "MEAL_COOKED",
    category: "Feature Usage",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT COUNT(*) FROM cooking_logs WHERE user_id = $1", [userId]);
      return parseInt(res.rows[0].count) >= 1;
    },
  },
  {
    name: "Chat Explorer",
    description: "Used the chat assistant",
    type: "CHAT_USED",
    category: "Feature Usage",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT COUNT(*) FROM chat_logs WHERE user_id = $1", [userId]);
      return parseInt(res.rows[0]?.count || 0) >= 1;
    },
  },
  {
    name: "Rewriter Rookie",
    description: "Used the recipe rewriter",
    type: "REWRITER_USED",
    category: "Feature Usage",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT COUNT(*) FROM rewriter_logs WHERE user_id = $1", [userId]);
      return parseInt(res.rows[0]?.count || 0) >= 1;
    },
  },
  {
    name: "List Master",
    description: "Generated a shopping list",
    type: "SHOPPING_LIST_GENERATED",
    category: "Feature Usage",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT COUNT(*) FROM shopping_lists WHERE user_id = $1", [userId]);
      return parseInt(res.rows[0]?.count || 0) >= 1;
    },
  },

  // Regional Cooking (10 XP)
  {
    name: "Northern Flavors",
    description: "Cooked 3 recipes from North India",
    type: "MEAL_COOKED_REGION",
    category: "Regional Cooking",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT north_indian_meals_cooked FROM users WHERE id = $1", [userId]);
      return parseInt(res.rows[0]?.north_indian_meals_cooked || 0) >= 3;
    },
  },
  {
    name: "Southern Spice",
    description: "Cooked 3 recipes from South India",
    type: "MEAL_COOKED_REGION",
    category: "Regional Cooking",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT south_indian_meals_cooked FROM users WHERE id = $1", [userId]);
      return parseInt(res.rows[0]?.south_indian_meals_cooked || 0) >= 3;
    },
  },
  {
    name: "Western Wonders",
    description: "Cooked 3 recipes from West India",
    type: "MEAL_COOKED_REGION",
    category: "Regional Cooking",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT west_indian_meals_cooked FROM users WHERE id = $1", [userId]);
      return parseInt(res.rows[0]?.west_indian_meals_cooked || 0) >= 3;
    },
  },
  {
    name: "Eastern Essence",
    description: "Cooked 3 recipes from East India",
    type: "MEAL_COOKED_REGION",
    category: "Regional Cooking",
    xpReward: 10,
    async check(userId, db) {
      const res = await db.query("SELECT east_indian_meals_cooked FROM users WHERE id = $1", [userId]);
      return parseInt(res.rows[0]?.east_indian_meals_cooked || 0) >= 3;
    },
  },

  // One-time Badge (optional manual)
  {
    name: "First Login",
    description: "Logged in for the very first time",
    type: "LOGIN_ONCE",
    category: "Milestone",
    xpReward: 10
  }
];

module.exports = badgeUtils;
