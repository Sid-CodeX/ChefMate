const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/ai/customize-recipe
 * @desc    Customize a given recipe based on user preference (e.g., vegan, quick, low-calorie)
 * @access  Protected (requires authentication)
 */
router.post('/customize-recipe', authMiddleware, aiController.customizeRecipe);

/**
 * @route   POST /api/ai/chat
 * @desc    Send a message to the AI chatbot and get a response
 * @access  Protected (requires authentication)
 */
router.post('/chat', authMiddleware, aiController.handleChat);

/**
 * @route   POST /api/ai/generate-shopping-list
 * @desc    Generate a shopping list from a list of dish names using AI
 * @access  Protected (requires authentication)
 */
router.post('/generate-shopping-list', authMiddleware, aiController.generateShoppingList); // This route is now active here

/**
 * @route   GET /api/ai/shopping-list
 * @desc    Retrieve the latest generated shopping list for the logged-in user
 * @access  Protected (requires authentication)
 */
router.get('/shopping-list', authMiddleware, aiController.getShoppingList);

module.exports = router;