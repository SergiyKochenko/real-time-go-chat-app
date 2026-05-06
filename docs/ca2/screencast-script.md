# CA2 Screencast Script (10 minutes max)

## 0:00 - 0:45 Intro and context

- Introduce yourself, module, and project.
- State the CA2 objective: implement and evaluate a GitOps pipeline in GitHub Actions for a multi-developer workflow.
- Briefly mention the DevOps strategy and how CA2 operationalizes it.

## 0:45 - 2:10 Repository governance and collaboration controls

- Show `CODEOWNERS` and explain ownership boundaries.
- Show pull request template and explain quality/security checklist usage.
- Show issue templates and explain standardization of communication across dev/test/ops.

## 2:10 - 4:20 PR validation pipeline

- Open `.github/workflows/pr-validation.yml`.
- Explain parallel jobs:
  - frontend lint + build
  - backend syntax validation
  - secret scanning with Gitleaks
- Explain why fast feedback on PRs supports lead-time reduction.

## 4:20 - 6:00 DevSecOps pipeline

- Open `.github/workflows/security-devsecops.yml`.
- Explain CodeQL schedule and push triggers.
- Show dependency audit artifact generation and summary.
- Explain policy choice: report vulnerabilities now, then phase into stricter blocking once remediation is complete.

## 6:00 - 7:45 Multi-environment deployment and GitOps promotion

- Open `.github/workflows/deploy-gitops.yml`.
- Explain GitHub Environments (`development`, `staging`, `production`) and approvals.
- Explain `workflow_dispatch` promotion, artifact packaging by commit SHA, webhook deploy trigger, and health-check validation.
- Explain rollback readiness via retained release artifacts.

## 7:45 - 9:10 Results and DORA evaluation

- Present key outcomes:
  - quality gates active
  - security checks integrated
  - multi-environment deployment flow implemented
- Reference DORA metrics and explain baseline/target strategy.
- Mention current limitations and evidence-based recommendations.

## 9:10 - 10:00 Conclusion

- Summarize what was achieved and why it is DevOps-aligned.
- State next iteration priorities:
  - add automated tests
  - remediate dependency vulnerabilities
  - strengthen branch protection and release analytics
