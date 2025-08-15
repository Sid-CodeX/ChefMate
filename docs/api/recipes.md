# Recipes API Documentation 

This module provides endpoints for fetching, searching, and filtering recipe information. All recipe data is enhanced with a user-specific `is_cooked` status, indicating whether the logged-in user has previously cooked that meal.

## Base Path

The base path for all recipe endpoints is `/api/recipes`.

-----

## Endpoints

All endpoints require authentication and are protected by the `authMiddleware`. A valid JWT must be passed in the `Authorization` header as `Bearer <token>`.

-----

### 1\. `GET /api/recipes` (🔒 Requires Auth)

Retrieves all available recipes with the logged-in user's `is_cooked` status.

  * **Description:** Fetches a comprehensive list of recipes. Each recipe object will include an `is_cooked` boolean flag, indicating if the current user has marked that recipe as cooked.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved all recipes.
        ```json
        {
          "recipes": [
            {
              "id": "uuid",
              "name": "string",
              "description": "string",
              "prep_time": "number (minutes)",
              "cook_time": "number (minutes)",
              "servings": "number",
              "diet": "string",
              "course": "string",
              "region": "string",
              "image_url": "string (optional)",
              "ingredients": ["string"],
              "instructions": ["string"],
              "is_cooked": "boolean"
            },
            // ... more recipe objects
          ]
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to retrieve recipes due to a server error.

-----

### 2\. `GET /api/recipes/:id` (🔒 Requires Auth)

Retrieves a single recipe by its unique ID with the logged-in user's `is_cooked` status.

  * **Description:** Fetches detailed information for a specific recipe, identified by its ID. The response will include the `is_cooked` status for the current user.
  * **Path Parameters:**
      * `id`: `string` (UUID) - The unique identifier of the recipe.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved the recipe.
        ```json
        {
          "recipe": {
            "id": "uuid",
            "name": "string",
            "description": "string",
            "prep_time": "number (minutes)",
            "cook_time": "number (minutes)",
            "servings": "number",
            "diet": "string",
            "course": "string",
            "region": "string",
            "image_url": "string (optional)",
            "ingredients": ["string"],
            "instructions": ["string"],
            "is_cooked": "boolean"
          }
        }
        ```
      * **`404 Not Found`**: Recipe with the specified ID was not found.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to retrieve the recipe due to a server error.

-----

### 3\. `GET /api/recipes/search` (🔒 Requires Auth)

Searches for recipes by name with the logged-in user's `is_cooked` status.

  * **Description:** Allows users to find recipes by a search term in their name. The search is case-insensitive, and results include the `is_cooked` status for the current user.
  * **Query Parameters:**
      * `q`: `string` - The search term for the recipe name.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved matching recipes.
        ```json
        {
          "recipes": [
            {
              "id": "uuid",
              "name": "string",
              // ... other recipe details
              "is_cooked": "boolean"
            },
            // ... more matching recipe objects
          ]
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to search recipes due to a server error.

-----

### 4\. `GET /api/recipes/filter` (🔒 Requires Auth)

Filters recipes based on various criteria with the logged-in user's `is_cooked` status.

  * **Description:** Filters the recipe list based on specified diet, course, and/or region. Multiple filter parameters can be combined.
  * **Query Parameters:**
      * `diet`: `string` (optional) - Filter by diet type (e.g., "Vegetarian", "Vegan", "Gluten-Free").
      * `course`: `string` (optional) - Filter by meal course (e.g., "Breakfast", "Lunch", "Dinner", "Dessert").
      * `region`: `string` (optional) - Filter by regional cuisine (e.g., "North Indian", "South Indian", "Italian").
  * **Responses:**
      * **`200 OK`**: Successfully retrieved filtered recipes.
        ```json
        {
          "recipes": [
            {
              "id": "uuid",
              "name": "string",
              // ... other recipe details
              "is_cooked": "boolean"
            },
            // ... more filtered recipe objects
          ]
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to filter recipes due to a server error.