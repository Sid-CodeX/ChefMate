// backend/models/gamificationModel.js
const pool = require('../config/db');

const GamificationModel = {
    /**
     * Records a completed meal in the database.
     * @param {number} userId - The ID of the user who cooked the meal.
     * @param {number} recipeId - The ID of the recipe cooked.
     * @param {string} difficulty - The difficulty level of the recipe (e.g., 'Easy', 'Medium', 'Hard').
     * @param {number} actualCookTimeSeconds - The actual time spent cooking in seconds.
     * @returns {Promise<object>} The inserted record.
     */
    async recordCookedMeal(userId, recipeId, difficulty, actualCookTimeSeconds) {
        try {
            const result = await pool.query(
                `INSERT INTO cooked_meals (user_id, recipe_id, difficulty, actual_cook_time_seconds)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [userId, recipeId, difficulty, actualCookTimeSeconds]
            );
            return result.rows[0];
        } catch (error) {
            console.error('[DB] Failed to record cooked meal:', error);
            throw error;
        }
    },

    /**
     * Retrieves cooked meal statistics for a user, categorized by difficulty.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<object>} An object with total, easy, medium, and hard cooked counts.
     */
    async getCookedMealStats(userId) {
        try {
            const result = await pool.query(
                `SELECT
                    COUNT(*) AS total_cooked,
                    COUNT(CASE WHEN difficulty = 'Easy' THEN 1 END) AS easy_cooked,
                    COUNT(CASE WHEN difficulty = 'Medium' THEN 1 END) AS medium_cooked,
                    COUNT(CASE WHEN difficulty = 'Hard' THEN 1 END) AS hard_cooked
                 FROM cooked_meals
                 WHERE user_id = $1`,
                [userId]
            );
            return result.rows[0]; // Should return one row with counts
        } catch (error) {
            console.error('[DB] Failed to fetch cooked meal stats:', error);
            throw error;
        }
    }
};

module.exports = GamificationModel;