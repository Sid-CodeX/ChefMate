const pool = require("../config/db");

// Get all recipes
exports.getAllRecipes = async () => {
  const result = await pool.query("SELECT * FROM recipes ORDER BY name ASC");
  return result.rows;
};

// Get recipe by ID
exports.getRecipeById = async (id) => {
  const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
  return result.rows[0];
};

// Search recipes by name
exports.searchRecipesByName = async (query) => {
  const result = await pool.query(
    "SELECT * FROM recipes WHERE LOWER(name) LIKE LOWER($1) ORDER BY name ASC",
    [`%${query}%`]
  );
  return result.rows;
};

// Filter recipes by multiple criteria
exports.filterRecipes = async ({ diet, course, region }) => {
  let query = "SELECT * FROM recipes WHERE 1=1";
  const values = [];

  if (diet) {
    values.push(diet);
    query += ` AND diet = $${values.length}`;
  }

  if (course) {
    values.push(course);
    query += ` AND course = $${values.length}`;
  }

  if (region) {
    values.push(region);
    query += ` AND region = $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
};
