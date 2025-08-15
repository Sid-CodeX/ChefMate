# ChefMate API Documentation Overview 🧑‍🍳

Welcome to the comprehensive API documentation for **ChefMate**, your culinary companion application\!

This document serves as a central hub for all the available API endpoints. ChefMate's backend is designed to be robust and modular, providing functionalities for user authentication, recipe management, meal planning, favoriting, and AI-driven features.

-----

## Base API URL

All API requests should be prefixed with:
`https://[YOUR_BACKEND_API_BASE_URL]/api` (Replace `[YOUR_BACKEND_API_BASE_URL]` with the actual URL where the ChefMate API is hosted, e.g., `api.chefmateapp.com` or `localhost:5000` for local development.)

-----

## Authentication

Most endpoints in the ChefMate API require authentication. We use **JSON Web Tokens (JWT)** for secure user sessions. To access protected routes, you must include a valid JWT in the `Authorization` header of your requests, formatted as `Bearer <token>`.

For details on how to authenticate and obtain a token, please refer to the [Auth API Documentation](auth.md).

-----

## API Sections

Below is a list of all major API sections. Click on each link to navigate to the detailed documentation for that specific module, including available endpoints, request/response formats, and examples.

  * [**Auth API**](auth.md)
      * Handles user registration, login, logout, profile updates, and password changes.
  * [**Recipes API**](recipes.md)
      * Manages fetching, searching, and filtering of recipes, along with user-specific `is_cooked` status.
  * [**Favorites API**](favorites.md)
      * Allows users to manage their favorite recipes by adding, removing, and listing them.
  * [**AI API**](ai.md)
      * Provides AI-powered features for recipe customization, chatbot interactions, and shopping list generation.
  * [**Meal Planner API**](meal-plan.md)
      * Enables users to create, manage, and randomize their weekly meal plans.
  * [**Gamification API**](gamification.md)
      * Tracks user cooking achievements and statistics for gamified experiences.

-----

## Error Handling

The API generally follows standard HTTP status codes for responses. Common error responses include:

  * `400 Bad Request`: Invalid request payload or missing parameters.
  * `401 Unauthorized`: Authentication token is missing or malformed.
  * `403 Forbidden`: Authentication token is valid but the user does not have permission to access the resource.
  * `404 Not Found`: The requested resource could not be found.
  * `409 Conflict`: Request conflicts with the current state of the server (e.g., user already exists).
  * `500 Internal Server Error`: An unexpected error occurred on the server.
  * `504 Gateway Timeout`: The AI service is unreachable or timed out.

-----

For any questions or further assistance, please refer to the project's internal documentation or contact the development team.