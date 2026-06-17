# Quickstart: Dream Team Builder — Team Compatibility Platform

**Feature**: `001-team-compatibility` | **Date**: 2026-06-17

Runnable validation scenarios proving each user story works end-to-end. Implementation details belong in `tasks.md`; this guide defines *what to run and what to expect*.

## Prerequisites

- Node.js 22 LTS
- PostgreSQL 16 (local Docker or managed instance)
- Environment variables:
  ```text
  DATABASE_URL=postgresql://...
  AUTH_SECRET=<random-32-char-string>
  OPENAI_API_KEY=<key>   # or AZURE_OPENAI_* vars
  NEXTAUTH_URL=http://localhost:3000
  ```
- Commands (once scaffolded):
  ```bash
  npm install
  npx prisma migrate dev
  npm run dev          # starts app at http://localhost:3000
  npm run test         # Vitest unit/integration
  npm run test:e2e     # Playwright E2E
  ```

---

## Scenario 1: Build Personal Team Profile (P1)

**Goal**: Verify profile wizard, assessment, and completion status (US1, FR-001–FR-005).

### Steps

1. Register a new account at `/register` with email and password.
2. Complete profile wizard sections in order:
   - **Skills**: Add ≥2 skills with levels; mark one as primary.
   - **Assessment**: Answer all 20+ questionnaire items; submit.
   - **Goals**: Set project types, timeline, commitment level, interests.
   - **Past Projects**: Add at least one project with title and role.
3. View profile summary at `/profile`.

### Expected Outcomes

- [ ] Profile shows all submitted data (acceptance scenario 1).
- [ ] `completionStatus` is `complete`.
- [ ] Work-style summary is plain language, no jargon (acceptance scenario 3).
- [ ] API: `GET /api/v1/profiles/me` returns full profile JSON per [contracts/api.md](./contracts/api.md).

### Partial Profile Test

1. Register second user; save only skills section; log out and back in.
2. **Expected**: Prompted to finish remaining sections; saved skills persist (acceptance scenario 2).

### Stale Analysis Flag Test (requires Scenario 2 first)

1. Edit skills on a profile used in a prior analysis.
2. **Expected**: Previous analysis shows `status: "stale"` (acceptance scenario 4, FR-018).

---

## Scenario 2: Analyze Team Compatibility (P2)

**Goal**: Verify multi-member analysis report with scores, risks, and explanations (US2, FR-007–FR-011).

### Setup

- Three users (A, B, C) with `completionStatus: complete`.
- User A: frontend primary skill, high pace, exit-timeline goal.
- User B: frontend primary skill, research-timeline goal.
- User C: backend primary skill, collaborative style.

### Steps

1. Log in as User A.
2. Navigate to `/analysis/new`.
3. Select profiles for Users A, B, C.
4. Submit analysis request.
5. Wait for report (target ≤30 seconds, SC-002).

### Expected Outcomes

- [ ] Report includes all four dimension scores (FR-008).
- [ ] `successProbability` on 0–100 scale (FR-009).
- [ ] `skill_redundancy` risk flag for overlapping frontend skills (acceptance scenario 3).
- [ ] `goal_conflict` risk flag for timeline mismatch (edge case).
- [ ] Each dimension has plain-language explanation (FR-010, acceptance scenario 2).
- [ ] API: `POST /api/v1/analyses` → `GET /api/v1/analyses/:id` matches contract shape.

### Single-Member Rejection Test

1. Submit analysis with only User A's profile.
2. **Expected**: 422 with message explaining ≥2 profiles required (acceptance scenario 4).

### Skipped Assessment Test

1. User D registers, skips assessment, completes other sections.
2. Include User D in an analysis.
3. **Expected**: `confidenceLevel: "low"` with explanation (FR-017, edge case).

---

## Scenario 3: Get Team Composition Recommendations (P3)

**Goal**: Verify role recommendations from project description (US3, FR-012–FR-013).

### Steps

1. Log in as User A (complete profile).
2. Navigate to `/composition/new`.
3. Describe project:
   - Domain: `saas`
   - Stage: `idea`
   - Description: "AI task manager for remote teams"
   - Timeline: "6 months"
4. Submit without existing members.
5. Review recommendations.

### Expected Outcomes

- [ ] ≥3 recommended roles with skills and traits (acceptance scenario 1).
- [ ] Each recommendation has rationale tied to project goals (acceptance scenario 3).
- [ ] ≥3 actionable insights returned (SC-006).
- [ ] API: `POST /api/v1/compositions` response matches contract.

### Partial Team Test

1. Repeat with `existingMemberProfileIds` including User A and User C.
2. **Expected**: `filledRoles` shows covered positions; `gapRoles` highlights remaining needs (acceptance scenario 2, FR-013).

---

## Scenario 4: Discover Compatible Teammates (P4)

**Goal**: Verify discovery, visibility controls, and connections (US4, FR-014–FR-016).

### Setup

- Users A, B, C, D all with complete profiles.
- Users A, B, C: `discoverable: true`.
- User D: `discoverable: false`.

### Steps

1. Log in as User A; open `/discovery`.
2. Browse results; view User B's candidate detail.
3. Send connection request to User B.
4. Log in as User B; accept connection.
5. Log in as User A; search again — confirm User D not visible.

### Expected Outcomes

- [ ] Results ranked with compatibility preview and highlights (acceptance scenario 1).
- [ ] Candidate detail shows shared goals, complementary skills, friction points (acceptance scenario 2).
- [ ] User D absent from results (acceptance scenario 3, FR-015).
- [ ] User B receives notification; connection status transitions `pending` → `accepted` (acceptance scenario 4).
- [ ] API: `GET /api/v1/discovery`, `POST /api/v1/connections`, `PATCH /api/v1/connections/:id`.

### Empty State Test

1. Set overly narrow skill filter with no matches.
2. **Expected**: Empty state with guidance to broaden criteria (edge case).

---

## Automated Test Commands

| Command | Validates |
|---------|-----------|
| `npm run test -- compatibility` | Scorer unit tests: dimensions, risks, confidence |
| `npm run test -- schemas` | Zod schema validation for all API contracts |
| `npm run test:e2e -- profile` | Scenario 1 E2E |
| `npm run test:e2e -- analysis` | Scenario 2 E2E |
| `npm run test:e2e -- composition` | Scenario 3 E2E |
| `npm run test:e2e -- discovery` | Scenario 4 E2E |

---

## Success Criteria Mapping

| Criterion | Validated by |
|-----------|--------------|
| SC-001 (<20 min profile) | Scenario 1 (manual timing in user testing) |
| SC-002 (≤30s report) | Scenario 2 (measure `completedAt - createdAt`) |
| SC-003 (clear explanations) | Scenario 2 (user testing survey) |
| SC-004 (unrecognized risks) | Scenario 2 (user testing survey) |
| SC-005 (50% faster discovery) | Scenario 4 (onboarding baseline survey) |
| SC-006 (≥3 useful insights) | Scenario 3 |
| SC-007 (1,000 profiles) | Load test script (post-MVP, not in quickstart) |

---

## Next Step

Run `/speckit-tasks` to generate `tasks.md` from this plan, then `/speckit-implement` to scaffold the codebase and execute tasks.
