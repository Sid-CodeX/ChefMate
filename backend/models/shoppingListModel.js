const pool = require('../config/db');

const ShoppingListModel = {
    /**
     * Inserts a new shopping list for a user.
     * @param {number} userId - The user's ID.
     * @param {object} items - The shopping list content as a JSON object.
     * @returns {Promise<object>} The inserted record.
     */
    async saveShoppingList(userId, items) {
        try {
            // ✨ UPDATED: Directly stringify the items object
            const formattedItems = JSON.stringify(items);
            const result = await pool.query(
                `INSERT INTO shopping_lists (user_id, items) VALUES ($1, $2) RETURNING *`,
                [userId, formattedItems]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error saving shopping list:", error);
            throw error;
        }
    },

    /**
     * Retrieves the latest shopping list for a user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<object | null>} The latest shopping list or null.
     */
    async getLatestShoppingList(userId) {
        try {
            const result = await pool.query(
                `SELECT id, user_id, generated_at, items
                 FROM shopping_lists
                 WHERE user_id = $1
                 ORDER BY generated_at DESC
                 LIMIT 1`,
                [userId]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error fetching latest shopping list:", error);
            throw error;
        }
    },

    /**
     * Retrieves all shopping lists for a user.
     * @param {number} userId - The user's ID.
     * @returns {Promise<Array<object>>} List of shopping lists.
     */
    async getAllShoppingLists(userId) {
        try {
            const result = await pool.query(
                `SELECT id, user_id, generated_at, items
                 FROM shopping_lists
                 WHERE user_id = $1
                 ORDER BY generated_at DESC`,
                [userId]
            );
            return result.rows;
        } catch (error) {
            console.error("Error fetching all shopping lists:", error);
            throw error;
        }
    }
};

module.exports = ShoppingListModel;