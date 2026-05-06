# DevOps Coursework Assignment 2

Student: Sergiy Kochenko  
Student ID: L00186189  
Module: DevOps Pipelines  
Project: Real-Time Chat Application (MERN + Socket.IO)  
Document date: 5 May 2026

## Executive summary

This report documents the delivery of a GitHub Actions pipeline ecosystem that operationalizes the DevOps strategy for the real-time chat application. The solution provides automated quality gates, DevSecOps controls, multi-environment promotion, and governance tooling to support safe and repeatable delivery.

## Scope and alignment

The implementation aligns with CAMS principles:

- **Culture:** CODEOWNERS, PR templates, and review responsibility.
- **Automation:** CI/CD pipelines and GitOps-style promotion.
- **Measurement:** DORA-aligned metrics with automated snapshot exports.
- **Sharing:** Reusable templates and documented workflows.

For full technical detail and evaluation, see [DevOps_Pipeline_Report.md](DevOps_Pipeline_Report.md).

## Key outcomes

- CI runs on all branch pushes with fast feedback.
- Deployments are gated to `main` and protected environments.
- Security scanning includes CodeQL, dependency audits, and secret detection.
- Repository automation supports labeling and project board hygiene.

## Metrics and governance

| Metric | Baseline | Target | Measurement source |
|---|---:|---:|---|
| Deployment frequency | ~1/week | >= 2/week | Workflow run history + DORA snapshot |
| Lead time for changes | ~3 days | < 24 hours median | PR merge to deploy timestamps |
| Change failure rate | ~20% | < 15% | Failed deploys / total deploys |
| Mean time to recovery | ~6 hours | < 60 minutes | Incident close timestamps |

## References

1. Forsgren, N., Humble, J. and Kim, G. (2018) *Accelerate: The Science of Lean Software and DevOps*. IT Revolution.
2. DORA (Google Cloud) (2024) *DevOps Research and Assessment*. Available at: https://dora.dev
3. GitHub Docs (2026) *GitHub Actions documentation*. Available at: https://docs.github.com/actions
4. GitHub Docs (2026) *CodeQL code scanning*. Available at: https://docs.github.com/code-security/code-scanning
