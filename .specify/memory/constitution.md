<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: N/A (initial ratification)
- Added sections: Core Principles, Security & Compliance, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (no changes required)
  - .specify/templates/tasks-template.md ✅ (no changes required)
- Follow-up TODOs: None
-->

# Dream Team Builder Constitution

## Core Principles

### I. User-Centered Design

Every feature MUST solve a clear user problem and be demonstrable as an independent user journey. The UI MUST be responsive, accessible (WCAG 2.1 AA minimum), and usable on desktop and mobile viewports. Prefer plain language, consistent navigation, and predictable interactions over clever or novel patterns.

### II. Security First

All user input MUST be validated and sanitized on the server. Authentication and authorization MUST be enforced for protected resources. Secrets, API keys, and credentials MUST NOT be committed to source control. Use environment variables or a secure secrets manager for configuration. Apply the principle of least privilege for data access and third-party integrations.

### III. Test-Driven Quality

Critical user flows and business logic MUST have automated tests before or alongside implementation. Use the red-green-refactor cycle for new behavior: write a failing test, implement the minimum code to pass, then refactor. Bug fixes MUST include a regression test when feasible. Manual smoke testing is required for UI changes that affect primary workflows.

### IV. Clear Separation of Concerns

The application MUST separate presentation (UI), application logic (services/use cases), and data access (persistence/API). API contracts MUST be explicit and versioned when breaking changes occur. Frontend components MUST NOT embed business rules that belong in shared or server-side logic. Shared types or schemas SHOULD be defined once and reused across layers.

### V. Simplicity & Maintainability

Start with the simplest solution that meets requirements (YAGNI). Avoid premature abstraction, unnecessary dependencies, and speculative features. Code MUST be readable, consistently formatted, and organized by feature or domain—not by technical layer alone. Complexity MUST be justified in the implementation plan before it is introduced.

## Security & Compliance

- HTTPS MUST be used in all non-local environments.
- Dependencies MUST be kept current; known critical vulnerabilities MUST be addressed before release.
- Personal and sensitive data MUST be encrypted in transit and at rest where applicable.
- Error responses MUST NOT expose stack traces, internal paths, or sensitive details to end users.
- Logging MUST avoid recording secrets, full authentication tokens, or unnecessary personal data.

## Development Workflow

- Work proceeds spec → plan → tasks → implement using Spec Kit artifacts.
- Each feature MUST map to an independently testable user story with a clear acceptance criteria.
- Pull requests MUST be small, focused, and include tests for changed behavior.
- Constitution Check MUST be completed in the implementation plan before coding begins.
- Breaking changes to APIs or data models MUST be documented and communicated in the plan.

## Governance

This constitution supersedes ad-hoc practices for this project. All specifications, plans, and tasks MUST comply with these principles unless an explicit, documented exception is approved and recorded in the feature plan.

Amendments require updating this file, bumping the version per semantic versioning (MAJOR for principle removals or incompatible redefinitions, MINOR for new principles or material expansions, PATCH for clarifications), and reviewing dependent Spec Kit templates for consistency.

Compliance with this constitution SHOULD be verified during `/speckit-plan`, `/speckit-analyze`, and code review.

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
