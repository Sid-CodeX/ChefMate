const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  filterRecipes
} = require("../controllers/recipesController");
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/recipes/
 * @desc    Fetch all recipes for a logged-in user
 * @access  Protected
 */
router.get("/", authMiddleware, getAllRecipes);

/**
 * @route   GET /api/recipes/search?q=term
 * @desc    Search recipes by name for a logged-in user
 * @access  Protected
 */
router.get("/search", authMiddleware, searchRecipes);

/**
 * @route   GET /api/recipes/filter?diet=...&course=...&region=...
 * @desc    Filter recipes based on query parameters for a logged-in user
 * @access  Protected
 */
router.get("/filter", authMiddleware, filterRecipes);

/**
 * @route   GET /api/recipes/:id
 * @desc    Fetch a specific recipe by its ID for a logged-in user
 * @access  Protected
 */
router.get("/:id", authMiddleware, getRecipeById);

module.exports = router;
