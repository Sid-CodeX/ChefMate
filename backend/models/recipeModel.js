const pool = require("../config/db");

// Fetch all recipes with an 'is_cooked' status for a given user
exports.getAllRecipesWithStatus = async (userId) => {
  const result = await pool.query(
    `SELECT
      r.*,
      CASE WHEN cm.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_cooked
    FROM recipes r
    LEFT JOIN (SELECT DISTINCT recipe_id, user_id FROM cooked_meals WHERE user_id = $1) AS cm
      ON r.id = cm.recipe_id
    ORDER BY r.name ASC;`,
    [userId]
  );
  return result.rows;
};

// Fetch a single recipe by ID with its 'is_cooked' status for a given user
exports.getRecipeByIdWithStatus = async (id, userId) => {
  const result = await pool.query(
    `SELECT
      r.*,
      CASE WHEN cm.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_cooked
    FROM recipes r
    LEFT JOIN (SELECT DISTINCT recipe_id, user_id FROM cooked_meals WHERE user_id = $1) AS cm
      ON r.id = cm.recipe_id
    WHERE r.id = $2;`,
    [userId, id]
  );
  return result.rows[0];
};

// Search recipes by name and return with 'is_cooked' status for a given user
exports.searchRecipesByNameWithStatus = async (query, userId) => {
  const result = await pool.query(
    `SELECT
      r.*,
      CASE WHEN cm.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_cooked
    FROM recipes r
    LEFT JOIN (SELECT DISTINCT recipe_id, user_id FROM cooked_meals WHERE user_id = $1) AS cm
      ON r.id = cm.recipe_id
    WHERE LOWER(r.name) LIKE LOWER($2)
    ORDER BY r.name ASC;`,
    [userId, `%${query}%`]
  );
  return result.rows;
};

// Filter recipes by diet, course, and region with 'is_cooked' status for a given user
exports.filterRecipesWithStatus = async ({ diet, course, region }, userId) => {
  let query = `
    SELECT
      r.*,
      CASE WHEN cm.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_cooked
    FROM recipes r
    LEFT JOIN (SELECT DISTINCT recipe_id, user_id FROM cooked_meals WHERE user_id = $1) AS cm
      ON r.id = cm.recipe_id
    WHERE 1=1`;
  const values = [userId];

  if (diet) {
    values.push(diet);
    query += ` AND r.diet = $${values.length}`;
  }

  if (course) {
    values.push(course);
    query += ` AND r.course = $${values.length}`;
  }

  if (region) {
    values.push(region);
    query += ` AND r.region = $${values.length}`;
  }
  
  query += ` ORDER BY r.name ASC`;

  const result = await pool.query(query, values);
  return result.rows;
};

// Fetch a given number of random recipes (no user-specific cooked status)
exports.getRandomRecipes = async (count) => {
  try {
    const result = await pool.query(
      `
      SELECT id, name, prep_time, cook_time
      FROM recipes
      ORDER BY RANDOM()
      LIMIT $1;
      `,
      [count]
    );
    return result.rows;
  } catch (error) {
    console.error('[DB] Failed to fetch random recipes:', error);
    throw error;
  }
};
