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

interface GenerateShoppingListResponse {
    shoppingList: string;
    savedListId: number;
}

interface SaveMealPlanResponse {
    message: string;
    plan: WeeklyPlanEntry[];
}

export const mealPlannerService = {
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

    async generateShoppingList(token: string): Promise<GenerateShoppingListResponse> {
        const response = await fetch(`${API_BASE_URL}/planner/generate-shopping-list`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
            throw new Error(errorData.error || errorData.message || `Failed to generate shopping list: ${response.statusText}`);
        }

        return response.json();
    },

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

    // Service function for randomizing meals
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