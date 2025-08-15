### Meal Planner API Documentation 

This module provides functionalities for managing a user's weekly meal plan, including viewing, adding, updating, and deleting meal entries. It also includes an endpoint to automatically fill empty slots with random recipes.

-----

## Base Path

The base path for all meal planner endpoints is `/api/planner`.

-----

## Endpoints

All endpoints are protected by the `authMiddleware` and require a valid JWT passed in the `Authorization` header as `Bearer <token>`.

### 1\. `GET /api/planner/weekly-plan`

Retrieves the authenticated user's weekly meal plan.

  * **Description:** Fetches all meal plan entries for the current week, including details about the recipes assigned to each slot.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved the weekly plan.
        ```json
        {
          "plan": [
            {
              "id": "uuid",
              "day_of_week": "string",
              "meal_slot": "string",
              "recipe_id": "uuid",
              "recipe_name": "string",
              "prep_time": "number",
              "cook_time": "number"
            },
            // ... more meal plan entries
          ]
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to load the weekly plan.

### 2\. `POST /api/planner/weekly-plan/meal`

Adds or updates a meal plan entry.

  * **Description:** Creates a new meal plan entry or updates an existing one for a specific day and meal slot. This endpoint is idempotent.
  * **Request Body:**
    ```json
    {
      "day_of_week": "string",
      "meal_slot": "string",
      "recipe_id": "string (uuid)"
    }
    ```
      * `day_of_week`: The day of the week (e.g., "Monday", "Tuesday").
      * `meal_slot`: The meal slot (e.g., "breakfast", "lunch", "dinner").
      * `recipe_id`: The ID of the recipe to assign to this slot.
  * **Responses:**
      * **`200 OK`**: Meal plan entry was successfully saved or updated. The response includes the full updated weekly plan.
      * **`400 Bad Request`**: A required field is missing.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to save the meal plan entry.

### 3\. `DELETE /api/planner/weekly-plan/meal`

Deletes a meal plan entry.

  * **Description:** Removes a meal from a specific day and meal slot in the user's weekly plan.
  * **Request Body:**
    ```json
    {
      "day_of_week": "string",
      "meal_slot": "string"
    }
    ```
      * `day_of_week`: The day of the week (e.g., "Monday").
      * `meal_slot`: The meal slot (e.g., "breakfast").
  * **Responses:**
      * **`200 OK`**: Meal plan entry was successfully deleted. The response includes the full updated weekly plan.
      * **`400 Bad Request`**: A required field is missing.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to delete the meal plan entry.

### 4\. `POST /api/planner/random-meals`

Fills all empty meal plan slots with random recipes.

  * **Description:** This endpoint automatically populates any empty slots in the user's weekly meal plan with random recipes from the database.
  * **Responses:**
      * **`200 OK`**: Empty slots were successfully filled. The response includes the full updated weekly plan.
      * **`401 Unauthorized`**: Token missing.
      * **403 Forbidden**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to randomize the meal plan, possibly due to a lack of available recipes in the database.