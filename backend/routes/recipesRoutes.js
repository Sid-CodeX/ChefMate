const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  filterRecipes
} = require("../controllers/recipesController");

// @route   GET /api/recipes/
// @desc    Fetch all recipes
// @access  Public
router.get("/", getAllRecipes);

// @route   GET /api/recipes/search?q=term
// @desc    Search recipes by name
// @access  Public
router.get("/search", searchRecipes);

// @route   GET /api/recipes/filter?diet=...&course=...&region=...
// @desc    Filter recipes based on query parameters
// @access  Public
router.get("/filter", filterRecipes);

// @route   GET /api/recipes/:id
// @desc    Fetch a specific recipe by its ID
// @access  Public
router.get("/:id", getRecipeById);

module.exports = router;
