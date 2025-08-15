### Favorites API Documentation 

This module allows authenticated users to manage their favorite recipes. A user can add a recipe to their favorites, remove one, or retrieve their entire list of favorited recipes.

## Base Path
The base path for all favorites endpoints is `/api/favorites`.

---

## Endpoints

All endpoints are protected by the `authMiddleware` and require a valid JWT passed in the `Authorization` header as `Bearer <token>`.

### 1. `GET /api/favorites`
Retrieves all recipes that the authenticated user has marked as a favorite.

* **Description:** Fetches a list of all recipe IDs and associated details that the current user has favorited.
* **Responses:**
    * `200 OK`: Successfully retrieved the list of favorite recipes.
    * `401 Unauthorized`: Token missing.
    * `403 Forbidden`: Invalid or expired token.
    * `500 Internal Server Error`: Failed to retrieve favorite recipes.

### 2. `POST /api/favorites/:recipeId`
Adds a recipe to the authenticated user's favorites.

* **Description:** Adds a specific recipe to the user's favorites list. If the recipe is already a favorite, the request will return a `201` status, as the operation is **idempotent**.
* **Path Parameters:**
    * `recipeId`: `string` (UUID) - The unique identifier of the recipe to add.
* **Responses:**
    * `201 Created`: Recipe successfully added to favorites.
    * `401 Unauthorized`: Token missing.
    * `403 Forbidden`: Invalid or expired token.
    * `500 Internal Server Error`: Failed to add the recipe to favorites.

### 3. `DELETE /api/favorites/:recipeId`
Removes a recipe from the authenticated user's favorites.

* **Description:** Removes a specified recipe from the user's favorites list. This action is **idempotent**; deleting a recipe that isn't a favorite will not cause an error.
* **Path Parameters:**
    * `recipeId`: `string` (UUID) - The unique identifier of the recipe to remove.
* **Responses:**
    * `200 OK`: Recipe successfully removed from favorites.
    * `401 Unauthorized`: Token missing.
    * `403 Forbidden`: Invalid or expired token.
    * `500 Internal Server Error`: Failed to remove the recipe from favorites.