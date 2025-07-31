const pool = require('../config/db');

const WeeklyPlanModel = {
  /**
   * Retrieves a user's weekly meal plan with recipe details.
   * @param {number} userId - Authenticated user's ID.
   * @returns {Promise<Array>} Array of meal plan entries.
   */
  async getWeeklyPlan(userId) {
    try {
      const result = await pool.query(
        `
        SELECT
          wp.id,
          wp.day_of_week,
          wp.meal_slot,
          r.id AS recipe_id,
          r.name AS recipe_name,
          r.prep_time,
          r.cook_time
        FROM weekly_plan wp
        INNER JOIN recipes r ON wp.recipe_id = r.id
        WHERE wp.user_id = $1
        ORDER BY wp.day_of_week, wp.meal_slot;
        `,
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('[DB] Failed to fetch weekly plan:', error);
      throw error;
    }
  },

  /**
   * Inserts or updates a meal plan entry (one per user/day/slot).
   * @param {number} userId - User ID.
   * @param {string} dayOfWeek - e.g. "Monday".
   * @param {string} mealSlot - e.g. "lunch".
   * @param {number} recipeId - Recipe ID.
   * @returns {Promise<object>} The upserted row.
   */
  async saveMealPlanEntry(userId, dayOfWeek, mealSlot, recipeId) {
    try {
      const result = await pool.query(
        `
        INSERT INTO weekly_plan (user_id, day_of_week, meal_slot, recipe_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, day_of_week, meal_slot)
        DO UPDATE SET
          recipe_id = EXCLUDED.recipe_id,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
        `,
        [userId, dayOfWeek, mealSlot, recipeId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('[DB] Failed to save meal plan entry:', error);
      throw error;
    }
  },

  /**
   * Deletes a meal plan entry by user/day/slot.
   * @param {number} userId
   * @param {string} dayOfWeek
   * @param {string} mealSlot
   * @returns {Promise<number>} Number of rows deleted (0 or 1)
   */
  async deleteMealPlanEntry(userId, dayOfWeek, mealSlot) {
    try {
      const result = await pool.query(
        `
        DELETE FROM weekly_plan
        WHERE user_id = $1 AND day_of_week = $2 AND meal_slot = $3;
        `,
        [userId, dayOfWeek, mealSlot]
      );

      return result.rowCount;
    } catch (error) {
      console.error('[DB] Failed to delete meal plan entry:', error);
      throw error;
    }
  }
};

module.exports = WeeklyPlanModel;
