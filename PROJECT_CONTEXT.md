# Project Context — Primetrade Backend Assignment

## Assignment Goal
Build a Scalable REST API with JWT Authentication & Role-Based Access Control.
Includes a minimal React frontend for live testing.
Deadline: 3 days from start.

## Stack
- Backend: Node.js + Express + Prisma ORM + PostgreSQL
- Auth: JWT (access token in memory, refresh token in httpOnly cookie)
- Validation: Zod
- Docs: Swagger UI
- Frontend: React (Vite) + Axios
- Optional: Redis (caching), Docker

## Entities
- **User** — id, name, email, passwordHash, role (USER|ADMIN), createdAt
- **Task** — id, title, description, status, priority, dueDate, userId
- **RefreshToken** — id, token, userId, expiresAt

## Roles
- `USER` — manages own tasks only
- `ADMIN` — manages all users and all tasks

## API Version
All routes under `/api/v1/`

## Current Progress
- [ ] Backend scaffolded
- [ ] Prisma schema written
- [ ] Auth module (register, login, refresh, logout)
- [ ] Users module (admin CRUD)
- [ ] Tasks module (CRUD with ownership)
- [ ] Middleware: JWT auth, RBAC, Zod validation, error handler
- [ ] Swagger docs
- [ ] Frontend: Login/Register/Dashboard pages
- [ ] Docker compose

## Key Constraints
- Refresh token must be httpOnly cookie (not localStorage)
- Access token expires in 15 minutes
- Input sanitization via Zod on all POST/PATCH routes
- Passwords hashed with bcryptjs (salt rounds: 12)
- Rate limiting: 100 req / 15 min per IP

## File Locations
- Backend entry: `backend/src/app.js`
- Routes: `backend/src/routes/v1.js`
- Prisma schema: `backend/prisma/schema.prisma`
- Frontend entry: `frontend/src/main.jsx`
- Auth context: `frontend/src/context/AuthContext.jsx`

## Next Steps (Priority Order)
1. Scaffold Express app with folder structure
2. Write Prisma schema + run migration
3. Build auth module (most critical)
4. Build tasks CRUD with ownership check
5. Add Swagger annotations
6. Build React pages (Login → Dashboard → Tasks)
7. Write README + docs
8. Test end-to-end with seeded data
