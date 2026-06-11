# 📋 API Contracts — v1

Base URL: `http://localhost:5000/api/v1`

All responses follow this envelope:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "...", "message": "...", "statusCode": 400 } }
```

---

## 🔐 Auth Endpoints

### `POST /auth/register`

Register a new user account.

**Request Body**
```json
{
  "name": "Darshan Karthikeya",
  "email": "darshan@example.com",
  "password": "SecurePass@123"
}
```

Password rules: min 8 chars, 1 uppercase, 1 number, 1 special character.

**Response `201`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1abc...",
      "name": "Darshan Karthikeya",
      "email": "darshan@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGci..."
  }
}
```

Refresh token is set as `httpOnly` cookie.

**Errors**
| Status | Code        | Reason                  |
|--------|-------------|-------------------------|
| 422    | VALIDATION_ERROR | Invalid fields     |
| 409    | CONFLICT    | Email already registered |

---

### `POST /auth/login`

**Request Body**
```json
{
  "email": "darshan@example.com",
  "password": "SecurePass@123"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1abc...",
      "name": "Darshan Karthikeya",
      "role": "USER"
    },
    "accessToken": "eyJhbGci..."
  }
}
```

**Errors**
| Status | Code          | Reason                     |
|--------|---------------|----------------------------|
| 401    | UNAUTHORIZED  | Wrong email or password    |
| 422    | VALIDATION_ERROR | Missing fields          |

---

### `POST /auth/refresh`

Silently issue a new access token using the httpOnly refresh cookie.

**Request** — No body. Requires `refreshToken` cookie.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

**Errors**
| Status | Code         | Reason                          |
|--------|--------------|---------------------------------|
| 401    | UNAUTHORIZED | Missing or expired refresh token |

---

### `POST /auth/logout`

🔒 Requires: `Authorization: Bearer <token>`

Deletes refresh token from DB and clears cookie.

**Response `200`**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

## 👥 Users Endpoints

All routes require: `Authorization: Bearer <token>` + `role: ADMIN`

---

### `GET /users`

List all registered users.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clx1abc...",
        "name": "Darshan",
        "email": "darshan@example.com",
        "role": "USER",
        "createdAt": "2025-06-01T10:00:00Z",
        "_count": { "tasks": 5 }
      }
    ],
    "total": 1
  }
}
```

---

### `PATCH /users/:id/role`

Change a user's role.

**Request Body**
```json
{
  "role": "ADMIN"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": { "id": "clx1abc...", "role": "ADMIN" }
  }
}
```

**Errors**
| Status | Code      | Reason               |
|--------|-----------|----------------------|
| 404    | NOT_FOUND | User does not exist  |
| 400    | BAD_REQUEST | Cannot demote self |

---

### `DELETE /users/:id`

Permanently delete a user and all their tasks (cascade).

**Response `200`**
```json
{
  "success": true,
  "data": { "message": "User deleted successfully" }
}
```

---

## ✅ Tasks Endpoints

All routes require: `Authorization: Bearer <token>`

---

### `GET /tasks`

Get the authenticated user's tasks. Admins can hit `GET /tasks/all` for every user's tasks.

**Query Parameters**
| Param    | Type   | Default  | Description                              |
|----------|--------|----------|------------------------------------------|
| page     | number | 1        | Pagination page                          |
| limit    | number | 10       | Items per page (max 50)                  |
| status   | string | —        | Filter: PENDING, IN_PROGRESS, COMPLETED  |
| priority | string | —        | Filter: LOW, MEDIUM, HIGH                |
| sort     | string | createdAt| Sort field                               |
| order    | string | desc     | asc or desc                              |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "clx2xyz...",
        "title": "Build login API",
        "description": "JWT-based auth endpoint",
        "status": "COMPLETED",
        "priority": "HIGH",
        "dueDate": "2025-06-10T00:00:00Z",
        "createdAt": "2025-06-01T08:00:00Z",
        "userId": "clx1abc..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### `POST /tasks`

Create a new task.

**Request Body**
```json
{
  "title": "Build login API",
  "description": "JWT-based auth endpoint",
  "priority": "HIGH",
  "dueDate": "2025-06-10"
}
```

`title` is required. `priority` defaults to MEDIUM.

**Response `201`**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "clx2xyz...",
      "title": "Build login API",
      "status": "PENDING",
      "priority": "HIGH",
      "userId": "clx1abc..."
    }
  }
}
```

---

### `PATCH /tasks/:id`

Update a task. Users can only update their own tasks; admins can update any.

**Request Body** (all fields optional)
```json
{
  "title": "Updated title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "description": "Updated description",
  "dueDate": "2025-06-15"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "task": { "id": "clx2xyz...", "status": "IN_PROGRESS", "updatedAt": "2025-06-05T12:00:00Z" }
  }
}
```

**Errors**
| Status | Code       | Reason                          |
|--------|------------|---------------------------------|
| 403    | FORBIDDEN  | Trying to edit another user's task |
| 404    | NOT_FOUND  | Task does not exist             |

---

### `DELETE /tasks/:id`

Delete a task.

**Response `200`**
```json
{
  "success": true,
  "data": { "message": "Task deleted successfully" }
}
```

---

### `GET /tasks/all` (Admin only)

Returns tasks for all users with user info attached.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "clx2xyz...",
        "title": "Build login API",
        "status": "COMPLETED",
        "user": {
          "id": "clx1abc...",
          "name": "Darshan",
          "email": "darshan@example.com"
        }
      }
    ],
    "total": 1
  }
}
```

---

## 🔑 Authorization Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in 15 minutes. Use `POST /auth/refresh` to get a new one silently.
