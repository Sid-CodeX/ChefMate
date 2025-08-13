// backend/controllers/gamificationController.js
const GamificationModel = require('../models/gamificationModel');

/**
 * Records a completed meal.
 * @route POST /api/gamification/cooked-meal
 * @access Protected
 */
exports.recordCookedMeal = async (req, res) => {
    const userId = req.user.id;
    const { recipeId, difficulty, actualCookTimeSeconds } = req.body;

    if (!userId) return res.status(401).json({ error: 'Authentication required.' });
    if (!recipeId || !difficulty || actualCookTimeSeconds === undefined) {
        return res.status(400).json({ error: 'Recipe ID, difficulty, and actual cook time are required.' });
    }

    try {
        const record = await GamificationModel.recordCookedMeal(userId, recipeId, difficulty, actualCookTimeSeconds);
        res.status(201).json({ message: 'Cooked meal recorded successfully.', recordId: record.id });
    } catch (error) {
        console.error('[Gamification] Error recording cooked meal:', error.message);
        res.status(500).json({ error: 'Failed to record cooked meal.', details: error.message });
    }
};

/**
 * Get cooked meal statistics for the logged-in user.
 * @route GET /api/gamification/stats
 * @access Protected
 */
exports.getCookedMealStats = async (req, res) => {
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ error: 'Authentication required.' });

    try {
        const stats = await GamificationModel.getCookedMealStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        console.error('[Gamification] Error fetching cooked meal stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch cooked meal stats.', details: error.message });
    }
};