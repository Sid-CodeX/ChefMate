## Auth API Documentation 

This module handles all user-related functionality, including registration, authentication, profile management, and password changes. It uses a **JWT (JSON Web Token)**-based approach for session management and a middleware-based authentication system.

The base path for all authentication endpoints is `/api/auth`.

-----

### Endpoints

All endpoints marked with **(🔒 Requires Auth)** are protected by the `authMiddleware` and require a valid JWT passed in the `Authorization` header as `Bearer <token>`.

#### 1\. `POST /api/auth/register`

Registers a new user in the system.

  * **Description:** Creates a new user account with a name, email, and password. The password is automatically hashed before being stored. A JWT is returned upon successful registration.
  * **Request Body:**
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
  * **Responses:**
      * **`201 Created`**: User successfully registered.
      * **`409 Conflict`**: User with the provided email already exists.
      * **`500 Internal Server Error`**: Registration failed due to a server error.

#### 2\. `POST /api/auth/login`

Logs in an existing user and returns a JWT.

  * **Description:** Authenticates a user with their email and password. Upon success, it updates the user's login metadata (like streak count) and returns the user object and a new JWT.
  * **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  * **Responses:**
      * **`200 OK`**: User successfully logged in.
      * **`401 Unauthorized`**: Invalid credentials.
      * **`404 Not Found`**: User not found.
      * **`500 Internal Server Error`**: Login failed due to a server error.

#### 3\. `GET /api/auth/me` (🔒 Requires Auth)

Fetches the profile of the currently logged-in user.

  * **Description:** Retrieves the complete user object, including all profile and badge-related information.
  * **Responses:**
      * **`200 OK`**: User information retrieved successfully.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.
      * **`404 Not Found`**: User not found.

#### 4\. `PUT /api/auth/update` (🔒 Requires Auth)

Updates the name of the logged-in user.

  * **Description:** Allows the authenticated user to change their name.
  * **Request Body:**
    ```json
    {
      "name": "string"
    }
    ```
  * **Responses:**
      * **`200 OK`**: Profile successfully updated.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.

#### 5\. `PUT /api/auth/change-password` (🔒 Requires Auth)

Changes the password of the logged-in user.

  * **Description:** Allows an authenticated user to change their password.
  * **Request Body:**
    ```json
    {
      "newPassword": "string"
    }
    ```
  * **Responses:**
      * **`200 OK`**: Password successfully changed.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.

#### 6\. `POST /api/auth/logout` (🔒 Requires Auth)

Logs out the user.

  * **Description:** This endpoint doesn't invalidate the token on the server side (since JWTs are stateless), but it provides a clear client-side action for logging out.
  * **Responses:**
      * **`200 OK`**: User successfully logged out.
      * **`401 Unauthorized`**: Token missing.
      * **`403 Forbidden`**: Invalid or expired token.