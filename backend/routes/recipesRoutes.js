const express = require("express");
const router = express.Router();
const { getAllRecipes, getRecipeById, searchRecipes, filterRecipes } = require("../controllers/recipesController");


router.get("/", getAllRecipes);
router.get("/search", searchRecipes);
router.get("/filter", filterRecipes);
router.get("/:id", getRecipeById);

module.exports = router;
