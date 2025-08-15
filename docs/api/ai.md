# AI API Documentation 

This module provides AI-powered functionalities for recipe customization, chatbot interaction, and shopping list generation. These services interact with a Hugging Face Space API for their core AI logic and leverage Redis for caching responses.

## Base Path

The base path for all AI endpoints is `/api/ai`.

-----

## Endpoints

All endpoints are protected by the `authMiddleware` and require a valid JWT passed in the `Authorization` header as `Bearer <token>`.

### 1\. `POST /api/ai/customize-recipe` (🔒 Requires Auth)

Customizes a given recipe based on user preference.

  * **Description:** Sends an `originalRecipe` and a `customizationOption` to an AI service to rewrite the recipe according to the specified preference (e.g., "vegan", "low-calorie"). Responses are cached in Redis for 1 hour.
  * **Request Body:**
    ```json
    {
      "originalRecipe": "string",
      "customizationOption": "string"
    }
    ```
      * `originalRecipe`: The full text of the recipe to be customized.
      * `customizationOption`: The desired customization. Supported values include:
          * `vegan`
          * `low-calorie`
          * `quick`
          * `gluten-free`
          * `high-protein`
          * `kid-friendly`
          * `general` (Improves clarity and formatting)
  * **Responses:**
      * **`200 OK`**: Successfully customized the recipe.
        ```json
        {
          "customizedRecipe": "string"
        }
        ```
      * **`400 Bad Request`**: Original recipe or customization option is missing.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: Unexpected response from AI service or request setup failed.
      * **`504 Gateway Timeout`**: AI service is unreachable or timed out.

-----

### 2\. `POST /api/ai/chat` (🔒 Requires Auth)

Sends a message to the AI chatbot and receives a response.

  * **Description:** Interacts with an AI chatbot by sending a user message and receiving an AI-generated reply. Chat responses are cached in Redis for 1 hour.
  * **Request Body:**
    ```json
    {
      "message": "string"
    }
    ```
      * `message`: The user's message to the chatbot.
  * **Responses:**
      * **`200 OK`**: Successfully received a reply from the AI chatbot.
        ```json
        {
          "reply": "string"
        }
        ```
      * **`400 Bad Request`**: Message is missing.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: AI service returned an invalid/empty response or internal server error.
      * **`504 Gateway Timeout`**: AI service is unreachable or timed out.

-----

### 3\. `POST /api/ai/generate-shopping-list` (🔒 Requires Auth)

Generates a shopping list from a list of dish names using AI.

  * **Description:** Takes an array of dish names and uses an AI service to generate a consolidated shopping list of ingredients. The generated list is saved to the database and cached in Redis.
  * **Request Body:**
    ```json
    {
      "dishNames": ["string"]
    }
    ```
      * `dishNames`: An array of strings, where each string is the name of a dish.
  * **Responses:**
      * **`200 OK`**: Successfully generated and saved the shopping list.
        ```json
        {
          "shoppingList": "string",
          "savedListId": "uuid"
        }
        ```
      * **`400 Bad Request`**: `dishNames` array is missing or empty.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`500 Internal Server Error`**: AI service returned an invalid/empty response or internal server error.
      * **`504 Gateway Timeout`**: AI shopping list service is unreachable or timed out.

-----

### 4\. `GET /api/ai/shopping-list` (🔒 Requires Auth)

Retrieves the latest generated shopping list for the logged-in user.

  * **Description:** Fetches the most recently generated shopping list associated with the authenticated user.
  * **Responses:**
      * **`200 OK`**: Successfully retrieved the latest shopping list.
        ```json
        {
          "shoppingList": "string",
          "generatedAt": "string (ISO 8601 timestamp)"
        }
        ```
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`404 Not Found`**: No shopping list found for this user.
      * **`500 Internal Server Error`**: Failed to load shopping list due to a server error.