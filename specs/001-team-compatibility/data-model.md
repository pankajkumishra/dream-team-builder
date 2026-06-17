# Data Model: Dream Team Builder — Team Compatibility Platform

**Feature**: `001-team-compatibility` | **Date**: 2026-06-17

## Entity Relationship Overview

```text
User 1──1 Profile 1──0..1 Assessment
  │         │
  │         ├──* PastProject
  │         └──* ProjectIntent
  │
  ├──* TeamAnalysis (as requester)
  ├──* CompositionRecommendation
  ├──* Connection (as initiator or recipient)
  └──1 VisibilitySettings

TeamAnalysis *──* Profile (via TeamAnalysisMember)
CompositionRecommendation *──* Profile (via CompositionMember, optional)
```

---

## User

Registered account holder. Owns profile, preferences, and visibility settings.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| email | String | unique, required | Auth identifier |
| emailVerified | DateTime? | | |
| name | String? | | Display name |
| image | String? | | Avatar URL |
| createdAt | DateTime | required | |
| updatedAt | DateTime | required | |

**Validation**: Email format validated server-side. Unique constraint prevents duplicate accounts.

---

## Profile

Structured representation of skills, experience, goals, and work-style summary.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| userId | UUID | FK → User, unique | One profile per user |
| headline | String? | max 120 chars | |
| bio | String? | max 500 chars | |
| skills | JSON | array of `{name, level, isPrimary}` | FR-002; level: beginner/intermediate/advanced/expert |
| experienceYears | Int? | 0–50 | |
| expertiseAreas | String[] | | e.g., "frontend", "ML", "go-to-market" |
| goals | JSON | `{projectTypes[], timeline, commitmentLevel, interests[]}` | FR-004 |
| workStyleSummary | String? | | LLM-generated plain-language summary |
| completionStatus | Enum | `draft`, `partial`, `complete` | Drives wizard prompts (US1) |
| profileVersion | Int | default 1, increment on material change | FR-018 stale detection |
| createdAt | DateTime | | |
| updatedAt | DateTime | | |

**Material change fields** (trigger stale analysis): `skills`, `goals`, linked `Assessment` responses, `workStyleSummary`.

**State transitions**:
```text
draft → partial (any section saved)
partial → complete (skills + assessment + goals + ≥1 past project)
complete → partial (user removes required section data)
```

---

## Assessment

Work-style questionnaire linked to a profile.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| profileId | UUID | FK → Profile, unique | One active assessment per profile (v1) |
| responses | JSON | `{questionId: likertValue}` | 20–25 items, values 1–5 |
| dimensionScores | JSON | `{dimension: normalizedScore}` | Computed on submit |
| completedAt | DateTime? | | null if skipped/incomplete |
| skipped | Boolean | default false | FR-017 reduced confidence |
| createdAt | DateTime | | |
| updatedAt | DateTime | | |

**Validation**: All submitted responses must be integers 1–5. Partial save allowed (wizard step).

---

## PastProject

Self-reported project history for collaboration context.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| profileId | UUID | FK → Profile | |
| title | String | required, max 100 | |
| description | String? | max 500 | |
| role | String? | | e.g., "lead developer" |
| outcome | Enum? | `completed`, `ongoing`, `abandoned` | |
| teamSize | Int? | 1–50 | |
| highlights | String[] | max 5 items | Achievements |
| createdAt | DateTime | | |

---

## ProjectIntent

User's description of what they want to build; drives composition recommendations.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| profileId | UUID | FK → Profile | |
| title | String | required | |
| domain | Enum | `saas`, `research`, `hackathon`, `student`, `other` | |
| stage | Enum | `idea`, `mvp`, `growth` | |
| description | String | max 1000 | |
| timeline | String? | | e.g., "3 months", "1 year" |
| goals | String[] | | Project-specific goals |
| createdAt | DateTime | | |

---

## TeamAnalysis

Compatibility evaluation of a specific group of profiles.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| requesterId | UUID | FK → User | Who initiated |
| projectIntentId | UUID? | FK → ProjectIntent | Optional context for skill gap analysis |
| memberProfileIds | UUID[] | min 2, max 6, unique | FR-007; duplicate user prevention |
| dimensionScores | JSON | see below | FR-008 |
| successProbability | Float | 0–100 | FR-009 |
| confidenceLevel | Enum | `high`, `medium`, `low` | FR-017 |
| riskFlags | JSON | array of `{type, severity, explanation}` | FR-011 |
| explanations | JSON | per-dimension plain-language text | FR-010 |
| status | Enum | `pending`, `complete`, `stale`, `failed` | FR-018 |
| memberProfileVersions | JSON | `{profileId: version}` | Snapshot for stale detection |
| createdAt | DateTime | | |
| completedAt | DateTime? | | |

**dimensionScores structure**:
```json
{
  "workStyleAlignment": 0.0-1.0,
  "goalAlignment": 0.0-1.0,
  "skillComplementarity": 0.0-1.0,
  "communicationFit": 0.0-1.0
}
```

**riskFlags types**: `skill_gap`, `skill_redundancy`, `goal_conflict`, `work_style_clash`, `incomplete_profile`, `low_confidence`.

**Validation rules**:
- Minimum 2 unique profiles (reject single-member with guidance message).
- No duplicate user IDs across member profiles.
- All member profiles must belong to distinct users.

---

## CompositionRecommendation

Suggested roles and traits for a project.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| requesterId | UUID | FK → User | |
| projectIntentId | UUID | FK → ProjectIntent | |
| existingMemberProfileIds | UUID[] | optional | FR-013 |
| recommendedRoles | JSON | array of role objects | FR-012 |
| filledRoles | JSON | roles covered by existing members | |
| gapRoles | JSON | roles still needed | |
| insights | JSON | ≥3 actionable insights target (SC-006) | |
| rationale | String | LLM-generated summary | FR-010 |
| createdAt | DateTime | | |

**recommendedRoles structure**:
```json
{
  "title": "Backend Engineer",
  "prioritySkills": ["Node.js", "PostgreSQL"],
  "idealTraits": ["structured", "high commitment"],
  "rationale": "..."
}
```

---

## VisibilitySettings

Controls discovery visibility and public profile fields.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| userId | UUID | FK → User, unique | |
| discoverable | Boolean | default false | FR-015 opt-in |
| showSkills | Boolean | default true | |
| showGoals | Boolean | default true | |
| showAssessmentSummary | Boolean | default true | |
| showPastProjects | Boolean | default false | |
| createdAt | DateTime | | |
| updatedAt | DateTime | | |

---

## Connection

Discovery match and connection request workflow.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | |
| initiatorId | UUID | FK → User | |
| recipientId | UUID | FK → User | |
| status | Enum | `pending`, `accepted`, `declined`, `withdrawn` | FR-016 |
| compatibilityPreview | JSON | summary highlights | |
| message | String? | max 300 | Optional intro |
| createdAt | DateTime | | |
| respondedAt | DateTime? | | |

**Validation**: Unique constraint on `(initiatorId, recipientId)` where status ≠ `withdrawn`. Cannot connect to self.

---

## Indexes (Performance)

| Table | Index | Purpose |
|-------|-------|---------|
| Profile | `userId` (unique) | Profile lookup |
| Profile | `completionStatus` | Discovery filter |
| VisibilitySettings | `discoverable` | Discovery queries |
| TeamAnalysis | `requesterId, createdAt` | User history |
| Connection | `recipientId, status` | Inbox queries |
| Profile | GIN on `skills`, `expertiseAreas` | Skill-based discovery (optional v1) |

---

## Privacy & Data Handling

- Profiles with `discoverable = false` excluded from discovery queries (FR-015).
- Private profiles can still be included in team analyses when explicitly invited by profile ID.
- Assessment raw responses visible only to profile owner; discovery shows summary only if `showAssessmentSummary = true`.
- Personal data encrypted in transit (HTTPS) and at rest (managed Postgres provider default).
