# Authentication API Documentation

This module handles all user-related authentication and profile management functionalities in the system. It uses **JWT** for session handling and protects sensitive routes with a middleware-based approach. Passwords are securely hashed using **bcrypt**.

-----

## Base Path

All endpoints listed below are prefixed with `/api/auth`.

-----

## Endpoints

### 1\. `POST /register`

Registers a new user in the system.

**Request Body:**

```json
{
  "name": "Sidharth",
  "email": "sidharth@example.com",
  "password": "securePassword"
}
```

**Success Response (201):**

```json
{
  "user": {
    "id": 1,
    "name": "Sidharth",
    "email": "sidharth@example.com",
    "level": 1,
    "xp": 0
  },
  "token": "JWT_TOKEN"
}
```

**Failure Cases:**

  * **409 Conflict:** User already exists
  * **500 Internal Server Error**

### 2\. `POST /login`

Logs an existing user in. Also updates login metadata (streak and last login time).

**Request Body:**

```json
{
  "email": "sidharth@gmail.com",
  "password": "password"
}
```

**Success Response (200):**

```json
{
  "user": {
    "id": 1,
    "name": "Sidharth",
    "email": "sidharth@gmail.com",
    "level": 1,
    "xp": 0,
    "streak": 4,
    "last_login": "2025-07-10T06:00:00.000Z"
  },
  "token": "JWT_TOKEN"
}
```

**Failure Cases:**

  * **404 Not Found:** User not found
  * **401 Unauthorized:** Invalid credentials
  * **500 Internal Server Error**

### 3\. `POST /logout`

**Protected Route**

Logs the user out (handled on frontend by deleting token). No session persistence is maintained on the server.

**Headers:**

```makefile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "message": "Logged out"
}
```

### 4\. `GET /me`

**Protected Route**

Fetches the currently logged-in user's profile data.

**Headers:**

```makefile
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "name": "Sidharth",
    "email": "sidharth@gmail.com",
    "level": 1,
    "xp": 0,
    "streak": 4,
    "last_login": "2025-07-10T06:00:00.000Z"
  }
}
```

### 5\. `PUT /update`

**Protected Route**

Updates the user's name.

**Request Body:**

```json
{
  "name": "Sidharth P"
}
```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "name": "Sidharth P",
    "email": "sidharth@gmail.com",
    "level": 1,
    "xp": 0,
    "streak": 4,
    "last_login": "2025-07-10T06:00:00.000Z"
  }
}
```

### 6\. `PUT /change-password`

**Protected Route**

Changes the current user's password.

**Request Body:**

```json
{
  "newPassword": "newpassword"
}
```

**Response (200):**

```json
{
  "message": "Password changed"
}
```

-----

## Core Concepts

### Password Security

Passwords are hashed with **bcrypt** (salt rounds = 10) before storing and are never exposed in responses.

### Token Handling

**JWTs** are generated at login and registration. They are used in `Authorization` headers for protected routes.

### Login Metadata

Each login updates:

  * `last_login` timestamp
  * Daily login `streak` (auto-incremented if last login was yesterday)

-----

## Utility Functions Used

| Function                       | Purpose                            |
| :----------------------------- | :--------------------------------- |
| `findUserByEmail(email)`       | Find user record by email          |
| `createUser({ name, email, password })` | Insert new user into database      |
| `findUserById(id)`             | Get user profile by ID             |
| `updateUserName(id, name)`     | Update the user’s display name     |
| `updateUserPassword(id, password)` | Securely store new password        |
| `updateLoginMeta(userId)`      | Handle streak and login timestamp logic |

-----

## Middleware

All protected routes use `authMiddleware`. This middleware:

  * Validates the **JWT** token
  * Extracts `user.id` and adds it to `req.user`

-----

## Status

Fully implemented, tested, and integrated with frontend. 