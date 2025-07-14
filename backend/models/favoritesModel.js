const pool = require("../config/db");

// Fetch all favorite recipes for a user
exports.getUserFavorites = async (userId) => {
  const result = await pool.query(
    `SELECT r.* FROM favorites f
     JOIN recipes r ON f.recipe_id = r.id
     WHERE f.user_id = $1`,
    [userId]
  );
  return result.rows;
};

// Add a new recipe to user's favorites (ignores duplicates)
exports.addFavorite = async (userId, recipeId) => {
  await pool.query(
    `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, recipeId]
  );
};

// Remove a recipe from user's favorites
exports.removeFavorite = async (userId, recipeId) => {
  await pool.query(
    `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2`,
    [userId, recipeId]
  );
};
