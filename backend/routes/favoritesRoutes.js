// backend/routes/favoritesRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites
} = require("../controllers/favoritesController");

// Protected routes
router.get("/", authMiddleware, getFavorites);
router.post("/:recipeId", authMiddleware, addToFavorites);
router.delete("/:recipeId", authMiddleware, removeFromFavorites);

module.exports = router;
