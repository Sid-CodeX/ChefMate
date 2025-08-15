import { Recipe } from '../types/recipe';
import { FilterOptions } from '@/pages/Dashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RecipesApiResponse {
    recipes: Recipe[];
    message?: string;
}

export const recipeService = {
    getAllRecipes: async (token: string): Promise<Recipe[]> => {
        const response = await fetch(`${API_BASE_URL}/recipes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch all recipes');
        }
        const data: RecipesApiResponse = await response.json();
        return data.recipes;
    },

    searchRecipes: async (query: string, token: string): Promise<Recipe[]> => {
        const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to search recipes for "${query}"`);
        }
        const data: RecipesApiResponse = await response.json();
        return data.recipes;
    },

    filterRecipes: async (filters: FilterOptions, token: string): Promise<Recipe[]> => {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                values.forEach((value: string) => queryParams.append(key, value));
            }
        });

        const queryString = queryParams.toString();
        const response = await fetch(`${API_BASE_URL}/recipes/filter?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to filter recipes');
        }
        const data: RecipesApiResponse = await response.json();
        return data.recipes;
    },

    getRecipeById: async (id: string, token: string): Promise<Recipe | null> => {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch recipe with ID ${id}`);
        }
        const data: { recipe: Recipe } = await response.json();
        return data.recipe;
    },
};