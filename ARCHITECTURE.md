# 🏗️ Architecture — Primetrade Backend Assignment

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│         React (Vite) — localhost:5173                │
│   Login │ Register │ Dashboard │ Task Manager        │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/REST (Axios)
                     ▼
┌─────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                  │
│             Express.js — localhost:5000              │
│                                                      │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐  │
│  │  Auth MW     │  │  RBAC MW   │  │  Zod Validate│ │
│  │  (JWT verify)│  │(role check)│  │  (input san) │  │
│  └──────────────┘  └────────────┘  └─────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │           Versioned Route Registry            │    │
│  │   /api/v1/auth  /api/v1/users  /api/v1/tasks │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────┘
                              │
              ┌───────────────┴────────────┐
              ▼                            ▼
┌─────────────────────┐      ┌─────────────────────────┐
│   PostgreSQL (Prisma)│      │   Redis (Optional Cache) │
│                     │      │                          │
│  users              │      │  GET /tasks → TTL 60s    │
│  tasks              │      │  Session invalidation    │
│  refresh_tokens     │      │                          │
└─────────────────────┘      └─────────────────────────┘
```

---

## Module Breakdown

### `auth` module
Handles registration, login, token refresh, and logout.

- `POST /auth/register` → hash password → create user → return tokens
- `POST /auth/login` → verify credentials → issue JWT pair
- `POST /auth/refresh` → validate refresh token → issue new access token
- `POST /auth/logout` → delete refresh token from DB

### `users` module (Admin only)
- List all users
- Update user role
- Delete user

### `tasks` module
Core CRUD entity. Users manage their own tasks; admins see all.

- Ownership enforced at service layer — users can only read/edit/delete their own tasks
- Admins bypass ownership check via role middleware

---

## Database Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  passwordHash String
  role         Role     @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  tasks         Task[]
  refreshTokens RefreshToken[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

enum Role         { USER ADMIN }
enum TaskStatus   { PENDING IN_PROGRESS COMPLETED CANCELLED }
enum Priority     { LOW MEDIUM HIGH }
```

---

## Middleware Chain

Every protected request passes through:

```
Request
  → cors()
  → helmet()             # security headers
  → express.json()
  → rateLimiter          # 100 req/15min per IP
  → router
      → authenticateJWT  # verifies Bearer token
      → requireRole()    # optional role gate
      → validateRequest() # Zod schema check
      → controller
          → service
              → Prisma / Redis
```

---

## JWT Strategy

| Token          | Expiry | Storage (Frontend)      | Purpose                   |
|----------------|--------|-------------------------|---------------------------|
| Access Token   | 15 min | Memory (React state)    | API authorization         |
| Refresh Token  | 7 days | httpOnly cookie         | Silent re-auth            |

- Access token is **never** stored in localStorage to prevent XSS theft.
- Refresh token is **httpOnly**, **Secure**, **SameSite=Strict**.
- On refresh token rotation, old token is deleted from DB immediately.

---

## Error Handling

Centralized error middleware converts all thrown errors into consistent JSON:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email must be a valid email address",
    "statusCode": 422
  }
}
```

Error codes used: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`, `INTERNAL_ERROR`

---

## Frontend Architecture

```
src/
├── api/
│   ├── axiosInstance.js   # base URL + interceptors
│   ├── authApi.js         # login, register, refresh
│   └── tasksApi.js        # CRUD calls
├── context/
│   └── AuthContext.jsx    # token state, user role
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx      # protected, shows tasks
└── components/
    ├── TaskCard.jsx
    ├── TaskForm.jsx
    └── ProtectedRoute.jsx
```

Axios interceptor automatically attaches `Authorization: Bearer <token>` and handles 401 → silent refresh flow.
