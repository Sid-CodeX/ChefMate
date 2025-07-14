const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites
} = require("../controllers/favoritesController");

// @route   GET /api/favorites/
// @desc    Get all favorite recipes for the authenticated user
// @access  Protected
router.get("/", authMiddleware, getFavorites);

// @route   POST /api/favorites/:recipeId
// @desc    Add a recipe to the authenticated user's favorites
// @access  Protected
router.post("/:recipeId", authMiddleware, addToFavorites);

// @route   DELETE /api/favorites/:recipeId
// @desc    Remove a recipe from the authenticated user's favorites
// @access  Protected
router.delete("/:recipeId", authMiddleware, removeFromFavorites);

module.exports = router;
