// frontend/src/services/favoritesService.ts
import { Recipe } from '@/types/recipe'; // Import global Recipe type

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Interface for the API response when fetching favorite recipes.
 */
interface FavoritesApiResponse {
  favorites: Recipe[];
  message?: string;
}

/**
 * Service for interacting with the ChefMate Favorites API.
 * Centralizes all favorite recipe management logic.
 */
export const favoritesService = {
  /**
   * Fetches all favorite recipes for the authenticated user.
   * Requires an authentication token.
   * @param token User's authentication token.
   * @returns A promise resolving to an array of Recipe objects.
   * @throws Error if the API call fails or token is missing.
   */
  getFavorites: async (token: string): Promise<Recipe[]> => {
    if (!token) throw new Error('Authentication token is required to fetch favorites.');
    const response = await fetch(`${API_BASE_URL}/favorites/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch favorites');
    }
    const data: FavoritesApiResponse = await response.json();
    return data.favorites;
  },

  /**
   * Adds a recipe to the user's favorites.
   * Requires recipe ID and an authentication token.
   * @param recipeId The ID of the recipe to favorite.
   * @param token User's authentication token.
   * @throws Error if the API call fails or token is missing.
   */
  addToFavorites: async (recipeId: number, token: string): Promise<void> => {
    if (!token) throw new Error('Authentication token is required to add favorites.');
    const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({}) // Backend doesn't expect a body for this endpoint based on your controller
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add recipe to favorites.');
    }
  },

  /**
   * Removes a recipe from the user's favorites.
   * Requires recipe ID and an authentication token.
   * @param recipeId The ID of the recipe to unfavorite.
   * @param token User's authentication token.
   * @throws Error if the API call fails or token is missing.
   */
  removeFromFavorites: async (recipeId: number, token: string): Promise<void> => {
    if (!token) throw new Error('Authentication token is required to remove favorites.');
    const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove recipe from favorites.');
    }
  },
};