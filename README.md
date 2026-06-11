# 🔐 Scalable REST API — Auth & Role-Based Access Control

A production-ready backend with JWT authentication, RBAC, and full CRUD — built with Node.js, Express, and PostgreSQL. Includes a lightweight React frontend for live API interaction.

---

## 🧱 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js 20+                       |
| Framework    | Express.js                        |
| Database     | PostgreSQL (via Prisma ORM)       |
| Auth         | JWT (access + refresh tokens)     |
| Hashing      | bcryptjs                          |
| Validation   | Zod                               |
| Docs         | Swagger UI (`/api-docs`)          |
| Frontend     | React.js (Vite)                   |
| Optional     | Redis (caching), Docker           |

---

## 📁 Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/         # DB, env, swagger config
│   │   ├── middleware/      # auth, error, validation
│   │   ├── modules/
│   │   │   ├── auth/        # register, login, refresh
│   │   │   ├── users/       # user management (admin)
│   │   │   └── tasks/       # CRUD entity
│   │   ├── routes/          # versioned route registry
│   │   ├── utils/           # jwt, hash, response helpers
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── components/      # TaskCard, Navbar, AuthForm
│   │   ├── api/             # axios instance + API calls
│   │   └── context/         # AuthContext (JWT storage)
│   └── package.json
│
└── docs/
    ├── ARCHITECTURE.md
    ├── API_CONTRACTS.md
    ├── PROJECT_CONTEXT.md
    └── SCALABILITY.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally or via Docker
- (Optional) Redis for caching

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/primetrade-backend-assignment.git
cd primetrade-backend-assignment
```

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/primetrade_db"
JWT_SECRET="your_super_secret_key_here"
JWT_REFRESH_SECRET="your_refresh_secret_here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development

# Optional
REDIS_URL="redis://localhost:6379"
```

Run database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Seed an admin user (optional):

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`
Swagger docs at: `http://localhost:5000/api-docs`

---

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Default Credentials (After Seeding)

| Role  | Email               | Password     |
|-------|---------------------|--------------|
| Admin | admin@primetrade.ai | Admin@123    |
| User  | user@primetrade.ai  | User@123     |

---

## 🧪 API Overview

| Method | Endpoint                   | Auth     | Role  | Description            |
|--------|----------------------------|----------|-------|------------------------|
| POST   | /api/v1/auth/register      | ❌       | —     | Register new user      |
| POST   | /api/v1/auth/login         | ❌       | —     | Login, get JWT         |
| POST   | /api/v1/auth/refresh       | ❌       | —     | Refresh access token   |
| POST   | /api/v1/auth/logout        | ✅       | any   | Invalidate token       |
| GET    | /api/v1/users              | ✅       | admin | List all users         |
| PATCH  | /api/v1/users/:id/role     | ✅       | admin | Change user role       |
| DELETE | /api/v1/users/:id          | ✅       | admin | Delete user            |
| GET    | /api/v1/tasks              | ✅       | any   | Get own tasks          |
| POST   | /api/v1/tasks              | ✅       | any   | Create task            |
| PATCH  | /api/v1/tasks/:id          | ✅       | any   | Update task            |
| DELETE | /api/v1/tasks/:id          | ✅       | any   | Delete task            |
| GET    | /api/v1/tasks/all          | ✅       | admin | Get all users' tasks   |

Full request/response specs → [`docs/API_CONTRACTS.md`](./docs/API_CONTRACTS.md)

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

This spins up:
- Node.js backend on port 5000
- PostgreSQL on port 5432
- Redis on port 6379

---

## 📖 API Documentation

Interactive Swagger UI available at `/api-docs` once the server is running.

To export Postman collection: import `docs/postman_collection.json`.

---

## 🚀 Scalability

See [`docs/SCALABILITY.md`](./docs/SCALABILITY.md) for the full note on horizontal scaling, caching, microservices decomposition, and load balancing strategy.

---

## ✅ Evaluation Checklist

- [x] JWT authentication (access + refresh tokens)
- [x] Password hashing with bcryptjs
- [x] Role-based access control (user / admin)
- [x] Full CRUD on Tasks entity
- [x] API versioning (`/api/v1/`)
- [x] Input validation with Zod
- [x] Centralized error handling middleware
- [x] Swagger documentation
- [x] PostgreSQL with Prisma ORM
- [x] React frontend with protected routes
- [x] Scalability documentation

---

## 👨‍💻 Author

**R Darshan Karthikeya**
B.Tech CSE, IIITDM Kancheepuram
[GitHub](https://github.com/YOUR_USERNAME) • [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
