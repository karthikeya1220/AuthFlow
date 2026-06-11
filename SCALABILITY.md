# 🚀 Scalability Note

This document outlines how the current architecture is designed for scale and what the clear upgrade path looks like as traffic grows.

---

## Current Design Decisions That Aid Scalability

### 1. Stateless Authentication (JWT)
The server holds no session state. Every request is independently authorized via a signed JWT — meaning any number of server instances can handle any request without coordination. This is the foundation of horizontal scaling.

### 2. Versioned API (`/api/v1/`)
All routes are prefixed with a version. When breaking changes are needed, `/api/v2/` can be deployed alongside v1 without disrupting existing clients. Zero-downtime migrations become possible.

### 3. ORM with Connection Pooling (Prisma)
Prisma uses connection pooling by default, preventing connection exhaustion under concurrent load. For managed deployments, `PgBouncer` or `Prisma Accelerate` can be added in front of Postgres to pool across multiple backend instances.

### 4. Modular Folder Structure
Each domain (auth, users, tasks) is fully self-contained with its own routes, controllers, services, and schemas. New modules (e.g., `notifications`, `billing`) can be added without touching existing code — following the Open/Closed Principle.

### 5. Centralized Error Handling & Logging
A single error middleware catches all thrown errors. Swapping to a structured logger (Winston + Datadog/CloudWatch) requires changing one file.

---

## Scaling Path by Traffic Tier

### Tier 1 — Up to ~10K requests/day (current)
- Single Node.js process
- Single PostgreSQL instance
- No caching needed
- Deployed on a single VM (Railway, Render, or EC2 t3.small)

### Tier 2 — 10K–500K requests/day
**Add:**
- **Redis caching** for `GET /tasks` responses (TTL: 60 seconds). Cache key: `tasks:userId:page:limit:filters`
- **Rate limiting** using `express-rate-limit` + Redis store (already stubbed in middleware)
- **PM2 cluster mode** to utilize all CPU cores on a single server
- **Read replica** for PostgreSQL — redirect all SELECT queries to the replica

```
Load Balancer (Nginx)
      │
  ┌───┴───┐
  Node  Node    ← PM2 cluster (4 workers)
  └───┬───┘
      │
  PostgreSQL Primary + Read Replica
      + Redis Cache
```

### Tier 3 — 500K+ requests/day
**Decompose into microservices:**

| Service         | Responsibility                     | Scales independently |
|-----------------|------------------------------------|----------------------|
| auth-service    | Registration, login, token refresh | Low traffic, rarely  |
| user-service    | User management, role updates      | Low traffic          |
| task-service    | CRUD for tasks                     | High traffic, often  |
| notification-service | Email/push on task due dates  | Event-driven         |

Communication: REST for sync, **message queues (BullMQ / RabbitMQ)** for async (e.g., sending emails on registration).

---

## Caching Strategy

| Endpoint         | Strategy                  | TTL    | Invalidation              |
|------------------|---------------------------|--------|---------------------------|
| `GET /tasks`     | Cache-aside with Redis    | 60s    | On POST/PATCH/DELETE task |
| `GET /users`     | Cache-aside with Redis    | 120s   | On user role change       |
| JWT verification | No cache (stateless)      | —      | Token expiry handles it   |

Cache keys follow the pattern: `resource:identifier:params`
Example: `tasks:clx1abc:page1:limit10:statusPENDING`

---

## Database Scaling

1. **Indexes** — Already indexed on `userId` in Tasks and `email` in Users (Prisma `@unique`, `@relation`). Add composite index on `(userId, status)` for filtered queries.

2. **Soft deletes** — Add `deletedAt DateTime?` to avoid hard deletes, enabling audit trails and easier data recovery at scale.

3. **Partitioning** — When tasks table exceeds ~10M rows, partition by `userId` hash range or by `createdAt` month.

4. **Managed DB** — Move from self-hosted Postgres to **AWS RDS** or **PlanetScale** for automated failover, backups, and read replica provisioning.

---

## Docker & Deployment

A `docker-compose.yml` is provided to spin up the full stack locally:
- Node.js backend (port 5000)
- PostgreSQL (port 5432)
- Redis (port 6379)

For production, containerize with Docker and deploy on:
- **AWS ECS / Fargate** — managed container orchestration, auto-scaling groups
- **Kubernetes** — for full microservices decomposition at Tier 3
- **Vercel / Railway** — fast deployment for Tier 1–2

---

## Summary

| Concern          | Solution                                       |
|------------------|------------------------------------------------|
| Stateless auth   | JWT (no session store needed)                  |
| Horizontal scale | Stateless design → add instances behind LB     |
| DB bottleneck    | Read replicas + PgBouncer connection pooling   |
| Hot endpoints    | Redis cache with smart invalidation            |
| Future features  | Modular structure → microservices decomposition|
| Zero-downtime    | API versioning + blue-green deployment         |
| Observability    | Winston logging → Datadog / CloudWatch         |
