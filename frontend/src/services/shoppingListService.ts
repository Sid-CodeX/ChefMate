const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Response when a new shopping list is generated
interface ShoppingListResponse {
  shoppingList: string; 
  savedListId: number;
}

// Structure of the shopping list content
interface ShoppingListContent {
    content: string;
    dishes: string[];
}

// Response when fetching the latest shopping list
interface LatestShoppingListResponse {
    shoppingList: ShoppingListContent; 
    generatedAt: string;
}

export const shoppingListService = {
  /**
   * Generate a shopping list using AI from the selected dish names.
   * @param dishNames - Array of dish names (e.g., ["Paneer Butter Masala", "Aloo Gobi"])
   * @param token - User’s JWT token for authorization
   * @returns AI-generated shopping list and its unique ID
   * @throws Error if the request fails or the backend returns an error
   */
  async generateList(
    dishNames: string[],
    token: string
  ): Promise<ShoppingListResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/generate-shopping-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ dishNames }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
      throw new Error(
        errorData.error || errorData.message || `Failed to generate shopping list: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },

  /**
   * Fetches the latest AI-generated shopping list for the logged-in user.
   * @param token - User’s JWT token for authorization
   * @returns The latest saved shopping list or `null` if none exist
   * @throws Error if the request fails unexpectedly
   */
  async getLatestList(
    token: string
  ): Promise<LatestShoppingListResponse | null> {
    const response = await fetch(`${API_BASE_URL}/ai/shopping-list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return null; 
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
      throw new Error(
        errorData.error || errorData.message || `Failed to fetch shopping list: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  },
};