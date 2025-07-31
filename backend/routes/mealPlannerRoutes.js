const express = require('express');
const router = express.Router();
const mealPlannerController = require('../controllers/mealPlannerController');
const { authMiddleware } = require('../middlewares/authMiddleware'); 

/**
 * @route GET /api/planner/weekly-plan
 * @desc Get the logged-in user's weekly meal plan
 * @access Protected
 */
router.get('/weekly-plan', authMiddleware, mealPlannerController.getWeeklyPlan);

/**
 * @route POST /api/planner/generate-shopping-list
 * @desc Generate a shopping list based on the current weekly plan
 * @access Protected
 */
router.post('/generate-shopping-list', authMiddleware, mealPlannerController.generateShoppingListFromPlan);

// Add other routes for adding/updating/deleting meals in the plan here later
// router.post('/add-meal', authMiddleware, mealPlannerController.addMealPlanEntry);
// router.put('/update-meal/:id', authMiddleware, mealPlannerController.updateMealPlanEntry);

module.exports = router;