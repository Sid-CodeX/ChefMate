const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Make sure this path is correct

/**
 * @route   POST /api/ai/customize-recipe
 * @desc    Customize a given recipe based on user preference (e.g., vegan, quick, low-calorie)
 * @access  Protected (requires authentication)
 */
router.post('/customize-recipe', authMiddleware, aiController.customizeRecipe);

// New AI Chat Routes
/**
 * @route   POST /api/ai/chat
 * @desc    Send a message to the AI chatbot and get a response
 * @access  Protected (requires authentication)
 */
router.post('/chat', authMiddleware, aiController.handleChat);

/**
 * @route   GET /api/ai/chat/history
 * @desc    Retrieve the chat history for the logged-in user
 * @access  Protected (requires authentication)
 */
router.get('/chat/history', authMiddleware, aiController.getChatHistory);


// Future AI-related routes can be added here:
// router.post('/generate-shopping-list', authMiddleware, aiController.generateShoppingList); // Convert recipe into ingredients list, also protected

module.exports = router;