---
description: "Task list for Dream Team Builder — Team Compatibility Platform"
---

# Tasks: Dream Team Builder — Team Compatibility Platform

**Input**: Design documents from `/specs/001-team-compatibility/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Included per constitution (Test-Driven Quality) and plan (Vitest + Playwright for critical flows and business logic).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1–US4)
- All tasks include exact file paths

## Path Conventions

- **Monorepo**: `packages/shared/`, `backend/`, `frontend/`
- **Services**: `backend/src/services/` (business logic only)
- **API**: `frontend/src/app/api/v1/` (Next.js Route Handlers calling backend services)
- **UI**: `frontend/src/features/` (domain-organized components)
- **Tests**: `backend/tests/`, `frontend/tests/e2e/`, `packages/shared/src/schemas/*.test.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo, tooling, and project structure per plan.md

- [x] T001 Create npm workspaces monorepo root in `package.json`
- [x] T002 [P] Initialize shared package with TypeScript and Zod in `packages/shared/package.json` and `packages/shared/tsconfig.json`
- [x] T003 [P] Initialize backend package with Prisma in `backend/package.json` and `backend/tsconfig.json`
- [x] T004 [P] Initialize Next.js 15 frontend app in `frontend/package.json` and `frontend/tsconfig.json`
- [x] T005 [P] Configure ESLint and Prettier at repository root in `eslint.config.js` and `.prettierrc`
- [x] T006 [P] Configure Tailwind CSS in `frontend/tailwind.config.ts` and `frontend/src/app/globals.css`
- [x] T007 [P] Initialize shadcn/ui components config in `frontend/components.json`
- [x] T008 [P] Configure Vitest for backend in `backend/vitest.config.ts`
- [x] T009 [P] Configure Playwright E2E in `frontend/tests/e2e/playwright.config.ts`
- [x] T010 Create environment template in `.env.example` (DATABASE_URL, AUTH_SECRET, OPENAI_API_KEY, NEXTAUTH_URL)
- [x] T011 Create development setup guide in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story work

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Define full Prisma schema (User, Profile, Assessment, PastProject, ProjectIntent, TeamAnalysis, CompositionRecommendation, VisibilitySettings, Connection) in `backend/prisma/schema.prisma`
- [x] T013 Run initial database migration in `backend/prisma/migrations/`
- [x] T014 [P] Create standardized API error helper in `backend/src/lib/errors.ts`
- [x] T015 [P] Create authenticated API route wrapper in `backend/src/lib/api-handler.ts`
- [x] T016 Configure Auth.js with email/password and OAuth providers in `backend/src/lib/auth.ts`
- [x] T017 Create Auth.js catch-all route in `frontend/src/app/api/auth/[...nextauth]/route.ts`
- [x] T018 [P] Create OpenAI/Azure LLM client wrapper in `backend/src/lib/llm.ts`
- [x] T019 [P] Create shared error response Zod schema in `packages/shared/src/schemas/error.ts`
- [x] T020 [P] Create Prisma client singleton in `backend/src/lib/prisma.ts`
- [x] T021 Create root app layout with responsive navigation shell in `frontend/src/app/layout.tsx`
- [x] T022 Create login page in `frontend/src/app/(auth)/login/page.tsx`
- [x] T023 Create register page in `frontend/src/app/(auth)/register/page.tsx`
- [x] T024 [P] Unit test for error helper in `backend/tests/unit/errors.test.ts`

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Build Personal Team Profile (Priority: P1) 🎯 MVP

**Goal**: Users register, complete a multi-step profile wizard (skills, assessment, goals, past projects), and view a personal team-readiness summary.

**Independent Test**: Register a user, complete the profile wizard, and verify the profile summary reflects all submitted data (spec.md US1).

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T025 [P] [US1] Unit tests for ProfileSchema validation in `packages/shared/src/schemas/profile.test.ts`
- [x] T026 [P] [US1] Unit tests for AssessmentSchema validation in `packages/shared/src/schemas/assessment.test.ts`
- [x] T027 [P] [US1] Integration tests for profile endpoints in `backend/tests/integration/profile.test.ts`
- [x] T028 [P] [US1] E2E test for profile wizard flow in `frontend/tests/e2e/profile.spec.ts`

### Implementation for User Story 1

- [x] T029 [P] [US1] Create ProfileSchema in `packages/shared/src/schemas/profile.ts`
- [x] T030 [P] [US1] Create AssessmentSchema in `packages/shared/src/schemas/assessment.ts`
- [x] T031 [P] [US1] Create PastProjectSchema in `packages/shared/src/schemas/past-project.ts`
- [x] T032 [US1] Implement ProfileService with profileVersion increment on material changes in `backend/src/services/profile/profile.service.ts`
- [x] T033 [US1] Implement profile completion status calculator in `backend/src/services/profile/completion.service.ts`
- [x] T034 [US1] Implement assessment questionnaire config (20–25 Likert items, 6–8 dimensions) in `backend/src/services/assessment/questions.ts`
- [x] T035 [US1] Implement AssessmentService with dimension score computation in `backend/src/services/assessment/assessment.service.ts`
- [x] T036 [US1] Implement LLM work-style summary generator in `backend/src/services/assessment/summary.generator.ts`
- [x] T037 [US1] Implement PastProjectService in `backend/src/services/profile/past-project.service.ts`
- [x] T038 [P] [US1] Implement GET/PATCH `/api/v1/profiles/me` route in `frontend/src/app/api/v1/profiles/me/route.ts`
- [x] T039 [P] [US1] Implement GET/PUT `/api/v1/profiles/me/assessment` route in `frontend/src/app/api/v1/profiles/me/assessment/route.ts`
- [x] T040 [P] [US1] Implement POST assessment skip route in `frontend/src/app/api/v1/profiles/me/assessment/skip/route.ts`
- [x] T041 [P] [US1] Implement past-projects CRUD routes in `frontend/src/app/api/v1/profiles/me/past-projects/route.ts` and `[id]/route.ts`
- [x] T042 [US1] Create profile API client in `frontend/src/features/profile/profile.api.ts`
- [x] T043 [US1] Create multi-step ProfileWizard container in `frontend/src/features/profile/ProfileWizard.tsx`
- [x] T044 [P] [US1] Create SkillsStep component in `frontend/src/features/profile/steps/SkillsStep.tsx`
- [x] T045 [P] [US1] Create AssessmentStep component in `frontend/src/features/profile/steps/AssessmentStep.tsx`
- [x] T046 [P] [US1] Create GoalsStep component in `frontend/src/features/profile/steps/GoalsStep.tsx`
- [x] T047 [P] [US1] Create PastProjectsStep component in `frontend/src/features/profile/steps/PastProjectsStep.tsx`
- [x] T048 [US1] Create profile summary page with completion prompts in `frontend/src/app/profile/page.tsx`
- [x] T049 [US1] Create profile setup route redirecting incomplete users in `frontend/src/app/profile/setup/page.tsx`

**Checkpoint**: User Story 1 fully functional — register, complete wizard, view summary

---

## Phase 4: User Story 2 — Analyze Team Compatibility (Priority: P2)

**Goal**: Users select 2–6 profiles and receive a compatibility report with dimension scores, risk flags, success probability, and plain-language explanations.

**Independent Test**: Select two or more completed profiles, request analysis, receive report with scores, risks, and explanations within 30 seconds (spec.md US2, SC-002).

### Tests for User Story 2

- [x] T050 [P] [US2] Unit tests for CompatibilityScorer in `backend/tests/unit/compatibility-scorer.test.ts`
- [x] T051 [P] [US2] Unit tests for RiskDetector (skill gap, redundancy, goal conflict) in `backend/tests/unit/risk-detector.test.ts`
- [x] T052 [P] [US2] Unit tests for ConfidenceCalculator in `backend/tests/unit/confidence.test.ts`
- [x] T053 [P] [US2] Integration tests for analysis endpoints in `backend/tests/integration/analysis.test.ts`
- [x] T054 [P] [US2] E2E test for team analysis flow in `frontend/tests/e2e/analysis.spec.ts`

### Implementation for User Story 2

- [x] T055 [P] [US2] Create TeamAnalysis request/response schemas in `packages/shared/src/schemas/analysis.ts`
- [x] T056 [US2] Implement CompatibilityScorer (work-style, goals, skills, communication dimensions) in `backend/src/services/compatibility/scorer.ts`
- [x] T057 [US2] Implement RiskDetector in `backend/src/services/compatibility/risk-detector.ts`
- [x] T058 [US2] Implement ConfidenceCalculator with skipped-assessment penalty in `backend/src/services/compatibility/confidence.ts`
- [x] T059 [US2] Implement LLM ExplanationGenerator from structured scores in `backend/src/services/compatibility/explanation.generator.ts`
- [x] T060 [US2] Implement AnalysisService (create, poll, list, stale detection via profileVersion) in `backend/src/services/compatibility/analysis.service.ts`
- [x] T061 [US2] Hook ProfileService to mark analyses stale on material profile changes in `backend/src/services/profile/profile.service.ts`
- [x] T062 [P] [US2] Implement POST `/api/v1/analyses` route in `frontend/src/app/api/v1/analyses/route.ts`
- [x] T063 [P] [US2] Implement GET `/api/v1/analyses` list route in `frontend/src/app/api/v1/analyses/route.ts`
- [x] T064 [P] [US2] Implement GET `/api/v1/analyses/[id]` route in `frontend/src/app/api/v1/analyses/[id]/route.ts`
- [x] T065 [US2] Create analysis API client in `frontend/src/features/analysis/analysis.api.ts`
- [x] T066 [US2] Create team member selection page in `frontend/src/app/analysis/new/page.tsx`
- [x] T067 [US2] Create AnalysisReport component with dimension scores and risk flags in `frontend/src/features/analysis/AnalysisReport.tsx`
- [x] T068 [US2] Create analysis history page in `frontend/src/app/analysis/page.tsx`
- [x] T069 [US2] Add single-member rejection with guidance message (422) in `backend/src/services/compatibility/analysis.service.ts`

**Checkpoint**: User Stories 1 and 2 work independently — profile + team analysis

---

## Phase 5: User Story 3 — Get Team Composition Recommendations (Priority: P3)

**Goal**: Users describe a project and receive recommended roles, skill priorities, ideal traits, and gap analysis for existing members.

**Independent Test**: Describe a project, receive ≥3 actionable role/skill insights with rationale (spec.md US3, SC-006).

### Tests for User Story 3

- [x] T070 [P] [US3] Integration tests for composition endpoint in `backend/tests/integration/composition.test.ts`
- [x] T071 [P] [US3] E2E test for composition flow in `frontend/tests/e2e/composition.spec.ts`

### Implementation for User Story 3

- [x] T072 [P] [US3] Create ProjectIntent and CompositionRecommendation schemas in `packages/shared/src/schemas/composition.ts`
- [x] T073 [US3] Implement domain role templates (saas, research, hackathon, student) in `backend/src/services/composition/role-templates.ts`
- [x] T074 [US3] Implement CompositionService with LLM rationale generation in `backend/src/services/composition/composition.service.ts`
- [x] T075 [US3] Implement filled/gap role logic for existing team members in `backend/src/services/composition/gap-analyzer.ts`
- [x] T076 [P] [US3] Implement POST `/api/v1/compositions` route in `frontend/src/app/api/v1/compositions/route.ts`
- [x] T077 [US3] Create composition API client in `frontend/src/features/composition/composition.api.ts`
- [x] T078 [US3] Create project description form page in `frontend/src/app/composition/new/page.tsx`
- [x] T079 [US3] Create CompositionResults component with roles and insights in `frontend/src/features/composition/CompositionResults.tsx`

**Checkpoint**: Composition recommendations work without discovery

---

## Phase 6: User Story 4 — Discover Compatible Teammates (Priority: P4)

**Goal**: Users browse discoverable profiles ranked by compatibility, control visibility, and send/accept connection requests.

**Independent Test**: User with complete profile sees ranked matches, views candidate details, sends connection; opt-out users are hidden (spec.md US4).

### Tests for User Story 4

- [x] T080 [P] [US4] Integration tests for discovery and connections in `backend/tests/integration/discovery.test.ts`
- [x] T081 [P] [US4] E2E test for discovery and connection flow in `frontend/tests/e2e/discovery.spec.ts`

### Implementation for User Story 4

- [x] T082 [P] [US4] Create VisibilitySettings schema in `packages/shared/src/schemas/visibility.ts`
- [x] T083 [P] [US4] Create Connection schema in `packages/shared/src/schemas/connection.ts`
- [x] T084 [US4] Implement DiscoveryService with SQL ranking and opt-in filter in `backend/src/services/discovery/discovery.service.ts`
- [x] T085 [US4] Implement lightweight compatibility preview scorer in `backend/src/services/discovery/preview-scorer.ts`
- [x] T086 [US4] Implement ConnectionService (create, accept, decline, list) in `backend/src/services/discovery/connection.service.ts`
- [x] T087 [P] [US4] Implement GET `/api/v1/discovery` route in `frontend/src/app/api/v1/discovery/route.ts`
- [x] T088 [P] [US4] Implement GET `/api/v1/discovery/[profileId]` route in `frontend/src/app/api/v1/discovery/[profileId]/route.ts`
- [x] T089 [P] [US4] Implement PUT `/api/v1/profiles/me/visibility` route in `frontend/src/app/api/v1/profiles/me/visibility/route.ts`
- [x] T090 [P] [US4] Implement POST/PATCH/GET `/api/v1/connections` routes in `frontend/src/app/api/v1/connections/route.ts` and `[id]/route.ts`
- [x] T091 [US4] Create discovery API client in `frontend/src/features/discovery/discovery.api.ts`
- [x] T092 [US4] Create discovery browse page with filters in `frontend/src/app/discovery/page.tsx`
- [x] T093 [US4] Create CandidateDetail component in `frontend/src/features/discovery/CandidateDetail.tsx`
- [x] T094 [US4] Create VisibilitySettings panel in `frontend/src/features/discovery/VisibilitySettings.tsx`
- [x] T095 [US4] Create connections inbox page in `frontend/src/app/connections/page.tsx`
- [x] T096 [US4] Add empty-state guidance when no matches found in `frontend/src/features/discovery/EmptyDiscovery.tsx`

**Checkpoint**: All four user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, security, performance, and validation across stories

- [x] T097 [P] Add database indexes per data-model.md in `backend/prisma/schema.prisma`
- [x] T098 Run and apply index migration in `backend/prisma/migrations/`
- [x] T099 [P] Add WCAG 2.1 AA fixes (focus rings, aria labels, keyboard nav) across `frontend/src/features/`
- [x] T100 [P] Add responsive layout polish for mobile viewports in `frontend/src/app/globals.css`
- [x] T101 Add API rate limiting middleware in `backend/src/lib/rate-limit.ts`
- [x] T102 Verify error responses never expose stack traces in `backend/src/lib/errors.ts`
- [x] T103 [P] Add loading and error boundary components in `frontend/src/components/LoadingState.tsx` and `ErrorBoundary.tsx`
- [x] T104 Run quickstart validation scenarios in `specs/001-team-compatibility/quickstart.md`
- [x] T105 Update deployment and environment docs in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **User Stories (Phases 3–6)**: All depend on Phase 2 completion
- **Polish (Phase 7)**: Depends on desired user stories being complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (P1) | Phase 2 only | MVP — no other stories required |
| US2 (P2) | Phase 2 + US1 profiles | Needs completed profiles to analyze; independently testable with seed data |
| US3 (P3) | Phase 2 + US1 profile | Uses ProjectIntent; optional existing members from US1 profiles |
| US4 (P4) | Phase 2 + US1 profiles | Discovery ranking uses preview scorer; needs multiple profiles for full value |

### Within Each User Story

1. Tests written and failing first
2. Shared Zod schemas before services
3. Services before API routes
4. API routes before frontend features
5. Checkpoint validation before next story

### Parallel Opportunities

- **Phase 1**: T002–T009 can run in parallel after T001
- **Phase 2**: T014, T018–T020, T024 in parallel after T012–T013
- **US1**: T025–T028 (tests), T029–T031 (schemas), T038–T041 (routes), T044–T047 (wizard steps) in parallel groups
- **US2**: T050–T054 (tests), T062–T064 (routes) in parallel groups
- **US3**: T070–T071 (tests) in parallel
- **US4**: T080–T081 (tests), T082–T083 (schemas), T087–T090 (routes) in parallel groups
- **Cross-story**: After Phase 2, different developers can own US1–US4 in parallel (US2–US4 need seed profiles)

---

## Parallel Example: User Story 1

```bash
# Tests first (parallel):
T025: packages/shared/src/schemas/profile.test.ts
T026: packages/shared/src/schemas/assessment.test.ts
T027: backend/tests/integration/profile.test.ts
T028: frontend/tests/e2e/profile.spec.ts

# Schemas (parallel):
T029: packages/shared/src/schemas/profile.ts
T030: packages/shared/src/schemas/assessment.ts
T031: packages/shared/src/schemas/past-project.ts

# Wizard steps (parallel after T043):
T044: frontend/src/features/profile/steps/SkillsStep.tsx
T045: frontend/src/features/profile/steps/AssessmentStep.tsx
T046: frontend/src/features/profile/steps/GoalsStep.tsx
T047: frontend/src/features/profile/steps/PastProjectsStep.tsx
```

---

## Parallel Example: User Story 2

```bash
# Scoring unit tests (parallel):
T050: backend/tests/unit/compatibility-scorer.test.ts
T051: backend/tests/unit/risk-detector.test.ts
T052: backend/tests/unit/confidence.test.ts

# API routes (parallel after T060):
T062: frontend/src/app/api/v1/analyses/route.ts (POST)
T063: frontend/src/app/api/v1/analyses/route.ts (GET list)
T064: frontend/src/app/api/v1/analyses/[id]/route.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE** against quickstart Scenario 1
5. Demo profile wizard and summary

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Profile wizard MVP → Deploy
3. US2 → Core compatibility analysis → Deploy
4. US3 → Composition recommendations → Deploy
5. US4 → Discovery and connections → Deploy

### Parallel Team Strategy

| Developer | Owns |
|-----------|------|
| A | Phase 1–2, then US1 |
| B | US2 (after Phase 2 + US1 seed data) |
| C | US3 (after Phase 2) |
| D | US4 (after Phase 2 + US1 seed data) |

---

## Notes

- [P] tasks = different files, no blocking dependency on incomplete tasks in the same group
- [Story] label maps every user-story task to spec.md priorities
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- LLM calls should be mocked in unit/integration tests; use test fixtures for deterministic scoring tests
