# Recommended Branch Protection Settings

Apply these rules in GitHub repository settings for `main` (and any temporary `release/*` branches if used):

1. Require a pull request before merging.
2. Require approvals: minimum 1 (2 for high-risk changes or production hotfixes).
3. Require review from Code Owners.
4. Require status checks to pass before merging:
   - Frontend Lint and Build
   - Backend Syntax Validation
   - Secret Scan (Gitleaks)
   - CodeQL Analysis
   - CI (backend + frontend tests)
5. Dismiss stale approvals when new commits are pushed.
6. Restrict direct pushes to protected branches.
7. Require linear history (optional, recommended).
8. Enforce squash merge for clean history.
9. Encourage AI-assisted pre-review (automated checks + summary) followed by human review for final approval.

This configuration enforces the collaboration and integration controls expected in the CA2 rubric.
