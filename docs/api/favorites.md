# Favorites API Documentation

This module handles adding, retrieving, and removing favorite recipes for authenticated users. Each user can mark multiple recipes as favorites and retrieve them later.

-----

## Base Path

All endpoints are protected and require a valid JWT token in the `Authorization` header.

-----

## Endpoints

### 1\. `GET /`

Get all favorite recipes of the logged-in user.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response (200):**

```json
{
  "favorites": [
    {
      "id": 2,
      "name": "Palak Paneer",
      "ingredients": "palak, paneer, spices...",
      "instructions": "...",
      "diet": "Vegetarian",
      "region": "North India",
      "image_url": "https://example.com/palak-paneer.jpg"
    },
    {
      "id": 5,
      "name": "Masala Dosa",
      "ingredients": "rice, lentils, potato...",
      "instructions": "...",
      "diet": "Vegetarian",
      "region": "South India",
      "image_url": "https://example.com/masala-dosa.jpg"
    }
  ]
}
```

**Failure Response:**

  * **500 Internal Server Error:** Database or internal issue

### 2\. `POST /:recipeId`

Add a specific recipe to the user's favorites list.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**

  * `recipeId` — ID of the recipe to be added

**Example:**

```bash
POST /api/favorites/5
```

**Success Response (201):**

```json
{
  "message": "Recipe added to favorites"
}
```

**Failure Response:**

  * **500 Internal Server Error**

### 3\. `DELETE /:recipeId`

Remove a specific recipe from the user's favorites list.

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**

  * `recipeId` — ID of the recipe to remove from favorites

**Example:**

```bash
DELETE /api/favorites/5
```

**Success Response (200):**

```json
{
  "message": "Recipe removed from favorites"
}
```

**Failure Response:**

  * **500 Internal Server Error**

-----

## Core Logic

  * Only authenticated users can access favorites.
  * Adding a duplicate favorite will be ignored (ON CONFLICT DO NOTHING).
  * Favorites are fetched with full recipe details using a SQL JOIN.

-----

## SQL Overview

| Action          | Query Summary                                 |
| :-------------- | :-------------------------------------------- |
| Get favorites   | JOIN favorites with recipes using `user_id`   |
| Add favorite    | `INSERT INTO favorites (user_id, recipe_id)`  |
| Remove favorite | `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2` |

-----

## Testing Notes

  * Ensure the user is logged in before calling any of these endpoints.
  * Recipes that don’t exist will not trigger a database error but may result in no-operations.
  * Use `/api/recipes` to verify recipe IDs beforehand.

-----

## Status

Fully implemented, tested, and integrated with user profile and recipe modules.