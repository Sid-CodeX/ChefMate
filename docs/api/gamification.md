### Gamification API Documentation 

This module handles gamification-related features, allowing users to track their progress and cooking achievements.

-----

## Base Path

The base path for all gamification endpoints is `/api/gamification`.

-----

## Endpoints

All endpoints are protected by the `authMiddleware` and require a valid JWT passed in the `Authorization` header as `Bearer <token>`.

### 1\. `POST /api/gamification/cooked-meal`

Records a completed meal for gamification and tracking.

  * **Description:** Records a meal that a user has finished cooking. This endpoint is crucial for tracking user progress and unlocking achievements.
  * **Request Body:**
    ```json
    {
      "recipeId": "string (uuid)",
      "difficulty": "string",
      "actualCookTimeSeconds": "number"
    }
    ```
      * `recipeId`: The ID of the recipe that was cooked.
      * `difficulty`: The difficulty level of the recipe, which should be one of `Easy`, `Medium`, or `Hard`.
      * `actualCookTimeSeconds`: The time in seconds the user took to cook the meal.
  * **Responses:**
      * **`201 Created`**: The cooked meal was successfully recorded.
        ```json
        {
          "message": "Cooked meal recorded successfully.",
          "recordId": "string (uuid)"
        }
        ```
      * **`400 Bad Request`**: A required field (`recipeId`, `difficulty`, or `actualCookTimeSeconds`) is missing from the request body.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to record the cooked meal due to a server error.

-----

### 2\. `GET /api/gamification/stats`

Gets cooked meal statistics for the authenticated user.

  * **Description:** Retrieves an overview of the user's cooking progress, including the total number of meals cooked and counts for each difficulty level.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved the user's cooking statistics.
        ```json
        {
          "total_cooked": "string",
          "easy_cooked": "string",
          "medium_cooked": "string",
          "hard_cooked": "string"
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Failed to fetch the cooked meal statistics.