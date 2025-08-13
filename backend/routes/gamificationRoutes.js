const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @route POST /api/gamification/cooked-meal
 * @desc Record a completed meal for gamification/tracking
 * @access Protected
 */
router.post('/cooked-meal', authMiddleware, gamificationController.recordCookedMeal);

/**
 * @route GET /api/gamification/stats
 * @desc Get cooked meal statistics for the logged-in user
 * @access Protected
 */
router.get('/stats', authMiddleware, gamificationController.getCookedMealStats);

module.exports = router;