// backend/controllers/favoritesController.js
const {
  getUserFavorites,
  addFavorite,
  removeFavorite
} = require("../models/favoritesModel");

// GET all favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.user.id);
    res.status(200).json({ favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    await addFavorite(req.user.id, recipeId);
    res.status(201).json({ message: "Recipe added to favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE remove from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    await removeFavorite(req.user.id, recipeId);
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
