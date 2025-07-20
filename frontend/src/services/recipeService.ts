// frontend/src/services/recipeService.ts
import { Recipe } from '../types/recipe';// We'll define this general type
import { FilterOptions } from '@/pages/Dashboard'; // Import FilterOptions interface

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Interface for API response containing multiple recipes.
 */
interface RecipesApiResponse {
  recipes: Recipe[];
  message?: string;
}

/**
 * Service for interacting with the ChefMate Recipe API.
 * Centralizes all recipe-related data fetching logic.
 */
export const recipeService = {

  /**
   * Fetches a list of all recipes.
   * @returns A promise that resolves to an array of Recipe objects.
   * @throws Error if the API call fails.
   */
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch all recipes');
    }
    const data: RecipesApiResponse = await response.json();
    return data.recipes;
  },

  /**
   * Searches recipes by a given query term.
   * @param query The search term.
   * @returns A promise that resolves to an array of Recipe objects.
   * @throws Error if the API call fails.
   */
  searchRecipes: async (query: string): Promise<Recipe[]> => {
    const response = await fetch(`${API_BASE_URL}/recipes/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to search recipes for "${query}"`);
    }
    const data: RecipesApiResponse = await response.json();
    return data.recipes;
  },

  /**
   * Filters recipes based on provided options.
   * @param filters An object containing filter criteria (diet, course, etc.).
   * @returns A promise that resolves to an array of Recipe objects.
   * @throws Error if the API call fails.
   */
  filterRecipes: async (filters: FilterOptions): Promise<Recipe[]> => {
    const queryParams = new URLSearchParams();
    // Append each filter array as multiple query parameters
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach((value: string) => queryParams.append(key, value));
      }
    });

    const queryString = queryParams.toString();
    const response = await fetch(`${API_BASE_URL}/recipes/filter?${queryString}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to filter recipes');
    }
    const data: RecipesApiResponse = await response.json();
    return data.recipes;
  },

  /**
   * Fetches a single recipe by its ID.
   * @param id The ID of the recipe.
   * @returns A promise that resolves to a Recipe object, or null if not found.
   * @throws Error if the API call fails.
   */
  getRecipeById: async (id: string): Promise<Recipe | null> => {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (response.status === 404) {
      return null; // Recipe not found
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch recipe with ID ${id}`);
    }
    const data: { recipe: Recipe } = await response.json(); // Backend returns { recipe: ... }
    return data.recipe;
  },
};