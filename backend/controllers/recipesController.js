const {
  getAllRecipesWithStatus,
  getRecipeByIdWithStatus,
  searchRecipesByNameWithStatus,
  filterRecipesWithStatus
} = require("../models/recipeModel");

// Fetch all recipes with user's saved status
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipesWithStatus(req.user.id);
    res.status(200).json({ recipes });
  } catch (err) {
    console.error("[RecipesController] Error getting all recipes:", err);
    res.status(500).json({ message: "Failed to retrieve recipes." });
  }
};

// Fetch a single recipe by ID with user's saved status
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await getRecipeByIdWithStatus(req.params.id, req.user.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ recipe });
  } catch (err) {
    console.error(`[RecipesController] Error getting recipe by ID ${req.params.id}:`, err);
    res.status(500).json({ message: "Failed to retrieve recipe." });
  }
};

// Search recipes by name with user-specific status
exports.searchRecipes = async (req, res) => {
  try {
    const recipes = await searchRecipesByNameWithStatus(req.query.q, req.user.id);
    res.status(200).json({ recipes });
  } catch (err) {
    console.error(`[RecipesController] Error searching recipes with query "${req.query.q}":`, err);
    res.status(500).json({ message: "Failed to search recipes." });
  }
};

// Filter recipes based on query parameters with user's saved status
exports.filterRecipes = async (req, res) => {
  try {
    const recipes = await filterRecipesWithStatus(req.query, req.user.id);
    res.status(200).json({ recipes });
  } catch (err) {
    console.error("[RecipesController] Error filtering recipes:", err);
    res.status(500).json({ message: "Failed to filter recipes." });
  }
};
