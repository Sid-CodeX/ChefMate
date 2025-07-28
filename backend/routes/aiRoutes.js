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

// Future AI-related routes can be added here:
// router.post('/chat', authMiddleware, aiController.chatCompletion); // For AI chatbot features, also protected
// router.post('/generate-shopping-list', authMiddleware, aiController.generateShoppingList); // Convert recipe into ingredients list, also protected

module.exports = router;