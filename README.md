# PrimeAuth

PrimeAuth is an enterprise-grade authentication and task management dashboard designed for performance, security, and scalability. It features a robust Node.js backend using Express and Prisma, paired with a modern React + Tailwind CSS frontend.

## Features

- **JWT Authentication Flow**: Stateless JWT access tokens (15m expiry) and secure HTTP-only refresh tokens (7d expiry) with automated rotation.
- **Enterprise RBAC**: Role-based access control with standard (`USER`) and administrative (`ADMIN`) roles.
- **Task Management**: Create, view, update, and delete tasks. Users manage their own tasks, while Admins have full oversight.
- **Modern UI/UX**: Premium aesthetic featuring a dark mode corporate design, utilizing Tailwind CSS and Google Fonts (Inter, Geist).
- **API Documentation**: Fully documented REST API accessible via Swagger UI.

## Tech Stack

### Backend
- Node.js & Express
- Prisma ORM
- PostgreSQL (or SQLite for local dev)
- Zod for payload validation
- JSON Web Tokens (jsonwebtoken) for stateless auth

### Frontend
- React 18 & Vite
- Tailwind CSS (v3.4) for styling and design tokens
- React Router DOM for client-side routing
- Axios for API communication (with JWT interceptors)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL (optional, defaults to SQLite if configured)

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRES_IN="15m"
   JWT_REFRESH_SECRET="your_refresh_secret"
   JWT_REFRESH_EXPIRES_IN="7d"
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   > API Documentation is available at: `http://localhost:5000/api-docs`

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > The application will typically be available at `http://localhost:5173`

## API Endpoints

### Auth Module (`/api/v1/auth`)
- `POST /register`: Create a new user account (defaults to `USER` role).
- `POST /login`: Authenticate and receive an access token and HTTP-only refresh token.
- `POST /refresh`: Generate a new access token using a valid refresh token.
- `POST /logout`: Clear the HTTP-only refresh token cookie.

### Tasks Module (`/api/v1/tasks`)
- `GET /`: Retrieve all tasks for the authenticated user.
- `POST /`: Create a new task.
- `PUT /:id`: Update a task (must be owned by user, or user must be `ADMIN`).
- `DELETE /:id`: Delete a task (must be owned by user, or user must be `ADMIN`).
- `GET /all`: Admin only. Retrieve all tasks across all users.

### Users Module (`/api/v1/users`)
- `GET /`: Admin only. Retrieve all users.
- `GET /me`: Retrieve the authenticated user's profile.

## Security Practices
- **Password Hashing**: Passwords are hashed using `bcrypt` before storage.
- **Token Storage**: Refresh tokens are stored securely in `httpOnly` cookies, mitigating XSS risks.
- **Payload Validation**: Strict request validation using `zod` to prevent malformed data.
- **RBAC Enforcement**: API routes are protected by middleware verifying user roles and data ownership.

## License
© 2024 PrimeAuth Engineering. All rights reserved.
