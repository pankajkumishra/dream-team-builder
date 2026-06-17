# API Contract: Dream Team Builder v1

**Base URL**: `/api/v1`  
**Auth**: Session cookie (Auth.js) or `Authorization: Bearer <token>` for API clients  
**Content-Type**: `application/json`  
**Date**: 2026-06-17

All request bodies validated with Zod schemas in `packages/shared/src/schemas/`. Error responses follow a consistent shape and MUST NOT expose stack traces (Constitution Security).

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "skills", "message": "At least one skill required" }]
  }
}
```

| HTTP Status | Code | When |
|-------------|------|------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid session |
| 403 | `FORBIDDEN` | Not allowed to access resource |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Duplicate connection, duplicate profile in team |
| 422 | `BUSINESS_RULE_VIOLATION` | e.g., team analysis with <2 members |
| 500 | `INTERNAL_ERROR` | Generic message only |

---

## Auth

Handled by Auth.js routes at `/api/auth/*`. No custom contract needed for sign-in/sign-out.

---

## Profile (US1)

### `GET /profiles/me`

Returns the authenticated user's profile with assessment summary and completion status.

**Response 200**:
```json
{
  "id": "uuid",
  "headline": "Full-stack founder",
  "skills": [{ "name": "TypeScript", "level": "advanced", "isPrimary": true }],
  "goals": { "projectTypes": ["saas"], "timeline": "6 months", "commitmentLevel": "full-time", "interests": ["AI"] },
  "workStyleSummary": "You thrive in collaborative, fast-paced environments...",
  "completionStatus": "partial",
  "profileVersion": 3,
  "pastProjects": [{ "id": "uuid", "title": "Hackathon App", "role": "lead" }]
}
```

### `PATCH /profiles/me`

Partial update. Increments `profileVersion` on material field changes. Marks dependent analyses stale.

**Request** (partial):
```json
{
  "headline": "Updated headline",
  "skills": [{ "name": "React", "level": "advanced", "isPrimary": true }]
}
```

**Response 200**: Updated profile object.

### `GET /profiles/:id`

View another user's profile. Respects [VisibilitySettings](#visibilitysettings-us4). Returns 403 if not discoverable and requester is not connected.

---

## Assessment (US1)

### `GET /profiles/me/assessment`

Returns assessment progress and dimension scores if completed.

### `PUT /profiles/me/assessment`

Save or submit assessment responses.

**Request**:
```json
{
  "responses": { "q1": 4, "q2": 2 },
  "submit": false
}
```

Set `"submit": true` to finalize. On submit, server computes `dimensionScores` and triggers LLM `workStyleSummary` generation.

**Response 200**:
```json
{
  "completedAt": "2026-06-17T10:00:00Z",
  "skipped": false,
  "dimensionScores": { "collaboration": 0.8, "pace": 0.6 },
  "workStyleSummary": "You prefer collaborative work..."
}
```

### `POST /profiles/me/assessment/skip`

Mark assessment as skipped. Sets `confidenceLevel` penalty for future analyses.

---

## Past Projects (US1)

### `POST /profiles/me/past-projects`

**Request**:
```json
{
  "title": "Research Platform",
  "role": "co-lead",
  "description": "Built a data collection tool for lab teams",
  "outcome": "completed",
  "teamSize": 4,
  "highlights": ["Published paper", "Recruited 3 collaborators"]
}
```

### `DELETE /profiles/me/past-projects/:id`

Remove a past project entry.

---

## Team Analysis (US2)

### `POST /analyses`

Create a team compatibility analysis.

**Request**:
```json
{
  "memberProfileIds": ["uuid-1", "uuid-2", "uuid-3"],
  "projectIntentId": "uuid-optional"
}
```

**Validation**:
- `memberProfileIds`: 2–6 unique IDs; no duplicate users.
- Returns 422 if only 1 member with guidance message.

**Response 202** (async processing):
```json
{
  "id": "uuid",
  "status": "pending"
}
```

### `GET /analyses/:id`

**Response 200** (complete):
```json
{
  "id": "uuid",
  "status": "complete",
  "memberProfiles": [{ "id": "uuid", "headline": "..." }],
  "dimensionScores": {
    "workStyleAlignment": 0.72,
    "goalAlignment": 0.55,
    "skillComplementarity": 0.81,
    "communicationFit": 0.68
  },
  "successProbability": 67.5,
  "confidenceLevel": "medium",
  "riskFlags": [
    {
      "type": "goal_conflict",
      "severity": "high",
      "explanation": "Two members have conflicting exit timelines — discuss before committing."
    },
    {
      "type": "skill_redundancy",
      "severity": "medium",
      "explanation": "Three members list frontend as a primary skill; no backend coverage detected."
    }
  ],
  "explanations": {
    "workStyleAlignment": "The team shows moderate alignment on pace and collaboration...",
    "goalAlignment": "Goals differ on exit timeline...",
    "overall": "This team has strong skill complementarity but goal alignment risks..."
  },
  "createdAt": "2026-06-17T10:00:00Z",
  "completedAt": "2026-06-17T10:00:15Z"
}
```

**Response 200** (stale):
```json
{
  "id": "uuid",
  "status": "stale",
  "staleReason": "Profile data changed for 1 team member since this analysis was run."
}
```

### `GET /analyses`

List requester's past analyses. Query: `?status=complete|stale|all`.

---

## Composition Recommendations (US3)

### `POST /compositions`

**Request**:
```json
{
  "projectIntent": {
    "title": "SaaS productivity tool",
    "domain": "saas",
    "stage": "idea",
    "description": "AI-assisted task management for remote teams",
    "timeline": "6 months",
    "goals": ["launch MVP", "acquire 100 users"]
  },
  "existingMemberProfileIds": ["uuid-optional"]
}
```

**Response 200**:
```json
{
  "id": "uuid",
  "recommendedRoles": [
    {
      "title": "Backend Engineer",
      "prioritySkills": ["Node.js", "PostgreSQL", "API design"],
      "idealTraits": ["structured", "reliable delivery"],
      "rationale": "Your MVP needs a scalable API layer before frontend polish."
    }
  ],
  "filledRoles": [{ "title": "Product/Design", "coveredBy": "uuid-1" }],
  "gapRoles": [{ "title": "Backend Engineer", "priority": "high" }],
  "insights": [
    "Add go-to-market skills before launch — common failure pattern for technical teams.",
    "Consider a co-founder with sales experience given B2B SaaS target.",
    "Current team lacks backend coverage for MVP timeline."
  ],
  "rationale": "For a 6-month SaaS MVP, a lean team of 3–4 with clear role boundaries..."
}
```

---

## Discovery & Connections (US4)

### `GET /discovery`

Search discoverable profiles ranked by compatibility relevance.

**Query params**:
- `skills` (comma-separated filter)
- `projectType` (enum)
- `limit` (default 20, max 50)
- `offset` (pagination)

**Response 200**:
```json
{
  "results": [
    {
      "profileId": "uuid",
      "headline": "ML researcher seeking co-founder",
      "compatibilityPreview": {
        "score": 78,
        "highlights": ["Complementary skills: ML + product", "Shared interest in research projects"],
        "frictionPoints": ["Different commitment levels"]
      }
    }
  ],
  "total": 12
}
```

**Response 200** (empty):
```json
{
  "results": [],
  "total": 0,
  "guidance": "No matches found. Try broadening skill filters or invite teammates to join."
}
```

### `GET /discovery/:profileId`

Detailed candidate view with shared goals, complementary skills, friction points.

### `PUT /profiles/me/visibility`

**Request**:
```json
{
  "discoverable": true,
  "showSkills": true,
  "showGoals": true,
  "showAssessmentSummary": true,
  "showPastProjects": false
}
```

### `POST /connections`

Send connection request.

**Request**:
```json
{
  "recipientId": "user-uuid",
  "message": "Interested in collaborating on your SaaS idea."
}
```

**Response 201**:
```json
{
  "id": "uuid",
  "status": "pending",
  "createdAt": "2026-06-17T10:00:00Z"
}
```

### `PATCH /connections/:id`

Accept or decline. Request: `{ "status": "accepted" | "declined" }`.

### `GET /connections`

List connections. Query: `?direction=inbox|sent|all&status=pending|accepted`.

---

## Shared Schema References

| Schema | Location | Used by |
|--------|----------|---------|
| `ProfileSchema` | `packages/shared/src/schemas/profile.ts` | Profile endpoints |
| `AssessmentSchema` | `packages/shared/src/schemas/assessment.ts` | Assessment endpoints |
| `TeamAnalysisRequestSchema` | `packages/shared/src/schemas/analysis.ts` | POST /analyses |
| `TeamAnalysisResultSchema` | `packages/shared/src/schemas/analysis.ts` | GET /analyses/:id |
| `CompositionRequestSchema` | `packages/shared/src/schemas/composition.ts` | POST /compositions |
| `DiscoveryQuerySchema` | `packages/shared/src/schemas/discovery.ts` | GET /discovery |
| `ConnectionRequestSchema` | `packages/shared/src/schemas/connection.ts` | POST /connections |
| `VisibilitySettingsSchema` | `packages/shared/src/schemas/visibility.ts` | PUT /profiles/me/visibility |

---

## Non-Functional Requirements

| Requirement | Contract implication |
|-------------|---------------------|
| SC-002 (≤30s report) | POST /analyses returns 202; poll GET /analyses/:id or use SSE (future) |
| FR-017 (confidence) | All analysis/composition responses include `confidenceLevel` |
| FR-018 (stale) | Analysis `status: "stale"` when `memberProfileVersions` mismatch |
| FR-019 (validation) | All inputs validated; 400 on failure |
| FR-020 (accessible UI) | UI contract: semantic HTML, ARIA labels on report cards (frontend concern) |
