# BookMyShow - System Design & Backend Architecture

High-scale Fastify + TypeScript backend architecture prototype demonstrating modular bootstrap initializations, feature-driven structure, and multi-service Docker configuration powered by `pnpm`.

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Package Manager**: `pnpm`
- **Framework**: Fastify
- **Documentation**: Swagger / OpenAPI 3.0 (`/docs`)
- **Language**: TypeScript (ES2022)
- **Linter**: Oxlint
- **Infrastructure**: Docker Compose (Modular include pattern)

## API Documentation (Swagger)

Swagger UI is available at:
```text
http://localhost:3000/docs
```

Interactive OpenAPI documentation includes tag filters, parameters schema, and direct try-it-out testing.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/docs` | Interactive Swagger API Documentation UI |
| `GET` | `/health` | Server health, uptime, and dependent services status |
| `GET` | `/api/v1/cities` | List available cities with optional search & state filter |
| `GET` | `/api/v1/cities/:id` | Get details of a single city |
| `GET` | `/api/v1/cinemas` | List cinemas with cityId and search filter |
| `GET` | `/api/v1/cinemas/:id` | Get details of a single cinema |
| `GET` | `/api/v1/shows` | List active shows with cinemaId & movieTitle filter |
| `GET` | `/api/v1/shows/:id` | Get show timing, price, and available seat counts |

## Quick Start (with pnpm)

### 1. Start Infrastructure Containers
```bash
pnpm infra:up
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Seed Database
```bash
pnpm seed
```

### 5. Lint
```bash
pnpm lint
```
