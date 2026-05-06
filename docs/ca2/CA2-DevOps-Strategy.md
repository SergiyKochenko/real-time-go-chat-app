# DevOps Strategy (CA2)

Student: Sergiy Kochenko  
Student number: L00186189  
Repository: https://github.com/SergiyKochenko/real-time-go-chat-app  
Document date: 5 May 2026

## 1. Executive summary

This strategy defines how DevOps practices will be embedded in the real-time chat application delivery process. It establishes a trunk-based development model, a measurable outcomes framework using DORA and complementary metrics, and a capability plan that leverages the DevOps engineer to lift the wider team. The approach emphasizes small batch sizes, automated quality gates, and continuous learning to ensure changes can be delivered safely and frequently.

## 2. Team composition and experience

| Role | Primary responsibilities | DevOps experience level |
|---|---|---|
| DevOps engineer | Pipeline design, governance, security controls | Intermediate |
| Backend developer | API design, data model, messaging services | Novice |
| Frontend developer | UI/UX, state management, testing | Novice |
| QA / tester | Manual test design, regression validation | Novice |
| Product owner | Scope, priorities, acceptance criteria | Novice |

**Experience assessment (confirmed):** Apart from the DevOps engineer, the team is novice in DevOps practices. This creates a capability gap that must be addressed early to make the delivery goals achievable.

## 3. Capability uplift plan

1. **Embedded mentorship:** Pair the DevOps engineer with each role for short, focused sessions (CI basics, secure secrets usage, testing standards).
2. **Working agreements:** Document a lightweight delivery contract (branch naming, PR size limits, required checks, definition of done).
3. **Automation-first culture:** Convert repeated manual tasks into workflow steps and templates to reduce variability.
4. **Shared dashboards:** Publish pipeline results and DORA snapshots weekly to create feedback loops.
5. **Post-incident learning:** Short retrospectives after failed builds or deployments to reinforce best practices.

## 4. Baseline metrics and measurement approach

The baseline below reflects the current manual delivery process observed over the last four weeks. These values are confirmed as the CA2 starting point and will be validated and refined using automated workflow telemetry in the next iteration.

| Metric | Current baseline | Evidence source |
|---|---|---|
| Deployment frequency | ~1 deployment per week | Manual release log + GitHub Actions history |
| Lead time for changes | ~3 days (median) | PR merge time to deployment |
| Change failure rate | ~20% | Failed deploys / total deploys |
| Mean time to recovery | ~6 hours | Incident log resolution timestamps |

Given the baseline and the planned automation uplift, the targets are achievable within the course delivery timeframe for this project scope.

## 5. Metrics strategy and justification

The four DORA metrics are retained because they capture delivery outcomes and are comparable across teams. To avoid Goodhart's law, they are paired with diagnostic metrics that help explain *why* changes occur:

- **Flow efficiency:** PR size, WIP limits, and review time
- **Quality:** Defect escape rate, test coverage trend, and flaky test rate
- **Reliability:** Pipeline failure rate, rollback frequency, and on-call load
- **Security debt:** Open vulnerability count and time-to-remediate
- **Sustainability:** After-hours commit ratio and cycle time variance

This aligns with DORA 2023/2025 guidance that encourages teams to look beyond the core four metrics and triangulate outcomes with supporting indicators.

This balanced scorecard discourages gaming of any single metric and keeps the focus on outcomes rather than outputs.

## 6. Branching strategy and release model

The project follows **trunk-based development**:

- `main` is the single long-lived branch.
- Feature work uses short-lived branches and is merged via PR with squash merge.
- **Feature flags** are used to integrate incomplete work safely into `main`.
- Release tags are created from `main`. Temporary `release/*` branches are only used for emergency stabilization.

**Review model:** AI-assisted pre-review (lint, static checks, change summary) is followed by a human review. Two reviewers are required for high-risk changes; one reviewer is sufficient for routine changes.

## 7. CI/CD and governance expectations

- CI runs on all branch pushes with fast feedback to the author.
- Deployments only occur from `main` after successful gates.
- Smoke test failures on `main` trigger a team-wide incident notification.
- Artifacts and deployment summaries are retained for audit and rollback.

## 8. Risks and mitigations

- **Skill gap:** mitigate through structured mentorship and shared runbooks.
- **Metric gaming:** mitigate with complementary metrics and qualitative review.
- **Release risk:** mitigate with feature flags and smoke tests.
- **Security debt:** mitigate with scheduled dependency scanning and remediation sprints.

## 9. Conclusion

The strategy is realistic for the current team maturity because it relies on automation, small batch sizes, and capability building led by the DevOps engineer. The baseline metrics and balanced scorecard provide a measurable path to improvement while avoiding metric-only decision making.
