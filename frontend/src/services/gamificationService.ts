const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RecordCookedMealResponse {
    message: string;
    recordId: number;
}

interface CookedMealStats {
    total_cooked: string; 
    easy_cooked: string;
    medium_cooked: string;
    hard_cooked: string;
}

export const gamificationService = {
    /**
     * Records a completed meal with its details.
     * @param {number} recipeId - The ID of the recipe cooked.
     * @param {string} difficulty - The difficulty of the recipe.
     * @param {number} actualCookTimeSeconds - The actual time spent cooking.
     * @param {string} token - User's authentication token.
     * @returns {Promise<RecordCookedMealResponse>} Confirmation of the record.
     */
    async recordCookedMeal(
        recipeId: number,
        difficulty: string,
        actualCookTimeSeconds: number,
        token: string
    ): Promise<RecordCookedMealResponse> {
        const response = await fetch(`${API_BASE_URL}/gamification/cooked-meal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId, difficulty, actualCookTimeSeconds }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to record cooked meal: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Fetches statistics for cooked meals for the logged-in user.
     * @param {string} token - User's authentication token.
     * @returns {Promise<CookedMealStats>} Cooked meal counts by difficulty.
     */
    async getCookedMealStats(token: string): Promise<CookedMealStats> {
        const response = await fetch(`${API_BASE_URL}/gamification/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to fetch cooked meal stats: ${response.statusText}`);
        }

        return response.json();
    }
};