# Dream Team Builder

AI-assisted platform to predict team compatibility before projects begin.

## Prerequisites

- Node.js 22 LTS
- PostgreSQL 16
- npm 10+

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
packages/shared/   # Zod schemas shared across layers
backend/           # Prisma models, services, business logic
frontend/          # Next.js 15 app (UI + API routes)
specs/             # Spec Kit design artifacts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |

## Testing

```bash
# Unit tests (schemas, scorer, risk detector)
npm test

# E2E tests (requires dev server)
npm run test:e2e
```

## Deployment

1. Set production environment variables (`DATABASE_URL`, `AUTH_SECRET`, `OPENAI_API_KEY`, `NEXTAUTH_URL`)
2. Run `npm run build`
3. Deploy the `frontend` Next.js app (e.g., Vercel)
4. Use a managed PostgreSQL instance (Neon, Supabase, Railway)

HTTPS is required in non-local environments.

## Feature Documentation

- [Specification](specs/001-team-compatibility/spec.md)
- [Implementation Plan](specs/001-team-compatibility/plan.md)
- [Tasks](specs/001-team-compatibility/tasks.md)
- [Quickstart Validation](specs/001-team-compatibility/quickstart.md)
