# Implementation Plan: Dream Team Builder — Team Compatibility Platform

**Branch**: `001-team-compatibility` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-team-compatibility/spec.md`

## Summary

Build an AI-assisted web platform that helps founders, students, and hackathon teams form better groups before projects begin. Users create rich personal profiles (skills, work-style assessment, goals, past projects), run team compatibility analyses with plain-language risk reports, receive composition recommendations for new ventures, and discover compatible teammates.

Technical approach: **Next.js 15 + TypeScript** monorepo with a **PostgreSQL** data layer, **Auth.js** authentication, **Zod** shared schemas, and a **hybrid analysis engine** — deterministic scoring for dimension scores and success probability, plus an LLM layer for human-readable explanations and composition guidance. See [research.md](./research.md) for decision rationale.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22 LTS

**Primary Dependencies**: Next.js 15, React 19, Prisma, Zod, Auth.js, Tailwind CSS, shadcn/ui, Vitest, Playwright, OpenAI SDK (or Azure OpenAI SDK)

**Storage**: PostgreSQL 16 (users, profiles, assessments, analyses, recommendations, connections, visibility settings)

**Testing**: Vitest (unit/integration for scoring services and API handlers), Playwright (E2E for profile wizard, team analysis, discovery flows)

**Target Platform**: Modern desktop and mobile browsers (responsive web application)

**Project Type**: Web application (frontend + API in monorepo)

**Performance Goals**: Team compatibility report ≤30 seconds for teams up to 6 members (SC-002); profile wizard completable in <20 minutes for 80% of users (SC-001); support 1,000 registered profiles without user-perceived degradation (SC-007)

**Constraints**: WCAG 2.1 AA; all input validated server-side; no secrets in source control; AI outputs must reference structured scoring factors (not opaque black-box scores); HTTPS in non-local environments

**Scale/Scope**: MVP covering user stories P1–P4; ~15–20 core screens; 1,000 registered users; self-reported project data only (no LinkedIn/GitHub import in v1)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate (Phase 0)

| Principle | Requirement | Plan Compliance | Status |
|-----------|-------------|-----------------|--------|
| I. User-Centered Design | Responsive, accessible UI; independent user journeys | Multi-step profile wizard, plain-language reports, mobile-first Tailwind + shadcn/ui (Radix) | ✅ PASS |
| II. Security First | Server-side validation, auth for protected resources, no secrets in repo | Auth.js, Zod validation on API routes, env-based LLM keys, Prisma parameterized queries | ✅ PASS |
| III. Test-Driven Quality | Automated tests for critical flows and business logic | Vitest on compatibility scorer + services; Playwright on P1/P2 E2E paths | ✅ PASS |
| IV. Separation of Concerns | UI / services / data access split; shared schemas | `frontend/` (presentation), `backend/src/services/` (logic), `packages/shared/` (Zod schemas) | ✅ PASS |
| V. Simplicity | YAGNI; justify complexity | Single language (TS), one DB, defer Redis/pgvector until load requires | ✅ PASS |

### Post-Design Gate (Phase 1)

| Principle | Design Artifact Evidence | Status |
|-----------|--------------------------|--------|
| I. User-Centered Design | [data-model.md](./data-model.md) supports partial profiles, confidence levels, stale-result flags; [contracts/api.md](./contracts/api.md) returns plain-language explanations | ✅ PASS |
| II. Security First | API contracts enforce auth on protected endpoints; visibility controls on Profile; input validation schemas documented | ✅ PASS |
| III. Test-Driven Quality | [quickstart.md](./quickstart.md) defines runnable validation scenarios per user story | ✅ PASS |
| IV. Separation of Concerns | Scoring logic in `CompatibilityService`; LLM limited to explanation generation; shared Zod types in `packages/shared/` | ✅ PASS |
| V. Simplicity | No microservices, no custom ML training, SQL-based discovery for MVP | ✅ PASS |

**Gate result**: All checks pass. No complexity tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/001-team-compatibility/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
packages/
└── shared/
    └── src/
        └── schemas/         # Zod schemas: Profile, Assessment, TeamAnalysis, etc.

backend/
├── prisma/
│   └── schema.prisma      # PostgreSQL models
├── src/
│   ├── api/               # Next.js Route Handlers / API controllers
│   ├── services/
│   │   ├── profile/
│   │   ├── assessment/
│   │   ├── compatibility/ # Deterministic scorer + risk detection
│   │   ├── composition/   # LLM-assisted role recommendations
│   │   └── discovery/     # Match ranking and visibility filters
│   └── lib/               # Auth, LLM client, error handling
└── tests/
    ├── unit/
    ├── integration/
    └── contract/

frontend/
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Shared UI primitives (shadcn/ui)
│   ├── features/
│   │   ├── profile/       # Profile wizard (US1)
│   │   ├── analysis/      # Team compatibility reports (US2)
│   │   ├── composition/   # Role recommendations (US3)
│   │   └── discovery/     # Teammate search and connections (US4)
│   └── services/          # Typed API client wrappers
└── tests/
    └── e2e/               # Playwright specs
```

**Structure Decision**: Web monorepo organized by feature domain in `frontend/src/features/` and by service domain in `backend/src/services/`. Shared Zod schemas in `packages/shared/` ensure API contracts are defined once and reused across layers (Constitution IV).

## Complexity Tracking

> No violations. Table intentionally left empty.
