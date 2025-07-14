const {
  getAllRecipes,
  getRecipeById,
  searchRecipesByName,
  filterRecipes
} = require("../models/recipeModel");

// Fetch all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.status(200).json({ recipes });
  } catch (err) {
    console.error("[RecipesController] Error getting all recipes:", err);
    res.status(500).json({ message: "Failed to retrieve recipes." });
  }
};

// Fetch a recipe by its ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ recipe });
  } catch (err) {
    console.error(`[RecipesController] Error getting recipe by ID ${req.params.id}:`, err);
    res.status(500).json({ message: "Failed to retrieve recipe." });
  }
};

// Search recipes by name using query string
exports.searchRecipes = async (req, res) => {
  try {
    const recipes = await searchRecipesByName(req.query.q);
    res.status(200).json({ recipes });
  } catch (err) {
    console.error(`[RecipesController] Error searching recipes with query "${req.query.q}":`, err);
    res.status(500).json({ message: "Failed to search recipes." });
  }
};

// Filter recipes using multiple optional query parameters
exports.filterRecipes = async (req, res) => {
  try {
    const recipes = await filterRecipes(req.query);
    res.status(200).json({ recipes });
  } catch (err) {
    console.error("[RecipesController] Error filtering recipes:", err);
    res.status(500).json({ message: "Failed to filter recipes." });
  }
};
