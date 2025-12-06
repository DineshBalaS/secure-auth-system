# API Documentation: Secure Authentication System

**Base URL**: `/api`  
**Version**: v1.0  
**Content-Type**: `application/json`

## Authentication Mechanism

This API uses **Stateless Session Management** via JWT (JSON Web Tokens).

- **Storage**: `HttpOnly`, `Secure`, `SameSite=Strict` Cookies.
- **Client Responsibility**: The client does not need to manually attach tokens to headers. The browser handles the cookie automatically for all requests to this domain.
- **Server Responsibility**: All protected endpoints must validate the JWT signature and expiration.

---

## 1. Authentication Endpoints

### 1.1 Register User

Creates a new user account and triggers the verification email workflow.

- **Endpoint**: `POST /auth/register`
- **Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "strongPassword123!"
}
```

**Constraints**:

- `email`: Valid email format.
- `password`: Minimum 8 characters.

**Success Response (201 Created)**:

```json
{
  "message": "Account created. Please verify your email.",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**:

- **400 Bad Request**: Validation failed (e.g., weak password).
- **409 Conflict**: Email already exists.
- **500 Internal Server Error**: Database or Email service failure.

---

### 1.2 Verify Email

Validates the token sent to the user's email and activates the account.

- **Endpoint**: `POST /auth/verify`
- **Access**: Public

**Request Body**:

```json
{
  "token": "a1b2c3d4e5f6..."
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Email verified successfully. You can now login."
}
```

**Error Responses**:

- **400 Bad Request**: Token is invalid, malformed, or expired.
- **404 Not Found**: User associated with token does not exist.

---

### 1.3 Login

Authenticates the user using Argon2id password verification and sets the Session Cookie.

- **Endpoint**: `POST /auth/login`
- **Access**: Public

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "strongPassword123!"
}
```

**Success Response (200 OK)**:
_Headers_: `Set-Cookie: auth_token=jwt_string; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=86400`

```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Error Responses**:

- **401 Unauthorized**: Invalid email or password.
- **403 Forbidden**: Email exists and password is correct, but account is not verified.

---

### 1.4 Logout

Destroys the session by invalidating the cookie.

- **Endpoint**: `POST /auth/logout`
- **Access**: Protected (User must be logged in, though technically callable by anyone)

**Request Body**: Empty

**Success Response (200 OK)**:
_Headers_: `Set-Cookie: auth_token=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0`

```json
{
  "message": "Logged out successfully"
}
```

---

## 2. User Resource Endpoints

### 2.1 Get Current User (Session Check)

Used by the frontend to persist state on page reload and validate the session.

- **Endpoint**: `GET /auth/me`
- **Access**: Protected (Requires valid Cookie)

**Request Headers**:

- `Cookie`: `auth_token=...` (Sent automatically)

**Success Response (200 OK)**:

```json
{
  "isAuthenticated": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "isVerified": true
  }
}
```

**Error Responses**:

- **401 Unauthorized**: Token missing, invalid signature, or expired.

```json
{
  "isAuthenticated": false,
  "error": "Unauthorized"
}
```

---

## 3. Standard Error Format

All API errors will return a JSON object in the following format to ensure the Frontend can handle them gracefully.

```json
{
  "error": "Brief error description",
  "details": "Optional detailed message (Zod validation errors, etc.)"
}
```
