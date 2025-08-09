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
 * @route POST /api/planner/weekly-plan/meal
 * @desc Add or update a meal plan entry
 * @access Protected
 */
router.post('/weekly-plan/meal', authMiddleware, mealPlannerController.saveMealToPlan);

/**
 * @route DELETE /api/planner/weekly-plan/meal
 * @desc Delete a meal plan entry
 * @access Protected
 */
router.delete('/weekly-plan/meal', authMiddleware, mealPlannerController.deleteMealFromPlan);

/**
 * @route POST /api/planner/random-meals
 * @desc Fill empty meal plan slots with random recipes
 * @access Protected
 */
router.post('/random-meals', authMiddleware, mealPlannerController.randomizeMealPlan); // New route

module.exports = router;