// backend/models/chatModel.js

const pool = require('../config/db'); // Database connection pool

const ChatModel = {
    /**
     * Fetches all chat messages for a user, ordered by timestamp
     * @param {number} userId
     * @returns {Promise<Array<{message: string, role: string, sent_at: Date}>>}
     */
    async getChatHistory(userId) {
        try {
            const result = await pool.query(
                `SELECT message, role, sent_at FROM chat_logs WHERE user_id = $1 ORDER BY sent_at ASC`,
                [userId]
            );
            return result.rows;
        } catch (error) {
            throw error; 
        }
    },

    /**
     * Saves a chat message from user or assistant to the database
     * @param {number} userId
     * @param {string} message
     * @param {'user' | 'assistant'} role
     */
    async saveChatMessage(userId, message, role) {
        try {
            await pool.query(
                `INSERT INTO chat_logs (user_id, message, role) VALUES ($1, $2, $3)`,
                [userId, message, role]
            );
        } catch (error) {
            throw error; 
        }
    }
};

module.exports = ChatModel;
