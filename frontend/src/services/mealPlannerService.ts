const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface WeeklyPlanEntry {
    id: number;
    day_of_week: string;
    meal_slot: string;
    recipe_id: number;
    recipe_name: string;
    prep_time: string;
    cook_time: string;
}

interface MealPlanApiResponse {
    plan: WeeklyPlanEntry[];
}

interface SaveMealPlanResponse {
    message: string;
    plan: WeeklyPlanEntry[];
}

export const mealPlannerService = {
    // Fetch the entire weekly meal plan
    async getWeeklyPlan(token: string): Promise<WeeklyPlanEntry[]> {
        const response = await fetch(`${API_BASE_URL}/planner/weekly-plan`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to fetch weekly plan: ${response.statusText}`);
        }

        const data: MealPlanApiResponse = await response.json();
        return data.plan;
    },

    // Save a meal to the weekly plan
    async saveMealToPlan(
        dayOfWeek: string,
        mealSlot: string,
        recipeId: number,
        token: string
    ): Promise<SaveMealPlanResponse> {
        const response = await fetch(`${API_BASE_URL}/planner/weekly-plan/meal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ day_of_week: dayOfWeek, meal_slot: mealSlot, recipe_id: recipeId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to save meal to plan: ${response.statusText}`);
        }

        return response.json();
    },

    // Delete a meal from the weekly plan
    async deleteMealFromPlan(
        dayOfWeek: string,
        mealSlot: string,
        token: string
    ): Promise<SaveMealPlanResponse> {
        const response = await fetch(`${API_BASE_URL}/planner/weekly-plan/meal`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ day_of_week: dayOfWeek, meal_slot: mealSlot }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to delete meal from plan: ${response.statusText}`);
        }

        return response.json();
    },

    // Generate a randomized weekly meal plan
    async randomizeMealPlan(token: string): Promise<SaveMealPlanResponse> {
        const response = await fetch(`${API_BASE_URL}/planner/random-meals`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to randomize meal plan: ${response.statusText}`);
        }

        return response.json();
    },
};
