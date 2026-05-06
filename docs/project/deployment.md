# Deployment and CI/CD

## Environments

- **Development:** automatic deployment on push to `main` (CI/CD workflow)
- **Staging:** promotion after successful development deployment
- **Production:** gated deployment with smoke tests and environment protection

## GitHub Actions workflows

- **CI + CD Pipeline:** `.github/workflows/cicd.yml`
  - Runs on all branch pushes
  - Builds and tests backend and frontend
  - Deploys only from `main`
  - Uploads coverage and build artifacts
  - Creates issue notifications for branch failures
  - Runs production smoke tests and raises an incident issue on failure

- **PR Validation:** `.github/workflows/pr-validation.yml`
  - Lint, build, and secret scan checks on pull requests

- **DevSecOps Security Scans:** `.github/workflows/security-devsecops.yml`
  - CodeQL analysis and dependency audit reports

- **GitOps Multi-Environment Deploy:** `.github/workflows/deploy-gitops.yml`
  - Artifact packaging, webhook deployment, and health checks

- **Repo Automation:** `.github/workflows/repo-automation.yml`
  - Auto-labels PRs and optionally adds work to a project board

- **DORA Metrics Snapshot:** `.github/workflows/dora-metrics.yml`
  - Exports workflow run data to support DORA metric tracking

## Deployment configuration

Environment values are provided via GitHub Actions variables and secrets. The backend `.env` file is generated during deployment and never committed to the repository.

## Manual deployment

Use the GitOps workflow to promote to a target environment when manual approval is required. Artifacts are retained to support audit and rollback workflows.
