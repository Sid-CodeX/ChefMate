const { getAllRecipes, getRecipeById, searchRecipesByName, filterRecipes } = require("../models/recipeModel");


exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchRecipes = async (req, res) => {
  try {
    const recipes = await searchRecipesByName(req.query.q);
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterRecipes = async (req, res) => {
  try {
    const recipes = await filterRecipes(req.query);
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
