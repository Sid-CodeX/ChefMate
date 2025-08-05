const {
  getUserFavorites,
  addFavorite,
  removeFavorite
} = require("../models/favoritesModel");

// Fetch all favorite recipes for the authenticated user
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.user.id);
    res.status(200).json({ favorites });
  } catch (err) {
    console.error("[FavoritesController] Error fetching favorites:", err);
    res.status(500).json({ message: "Failed to retrieve favorites." });
  }
};

// Add a recipe to the authenticated user's favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    await addFavorite(req.user.id, recipeId);
    res.status(201).json({ message: "Recipe added to favorites" });

  } catch (err) {
    console.error(`[FavoritesController] Error adding recipe ${req.params.recipeId} to favorites for user ${req.user.id}:`, err);
    res.status(500).json({ message: "Failed to add recipe to favorites." });
  }
};

// Remove a recipe from the authenticated user's favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { recipeId } = req.params;
    await removeFavorite(req.user.id, recipeId);
    res.status(200).json({ message: "Recipe removed from favorites" });

  } catch (err) {
    console.error(`[FavoritesController] Error removing recipe ${req.params.recipeId} from favorites for user ${req.user.id}:`, err);
    res.status(500).json({ message: "Failed to remove recipe from favorites." });
  }
};