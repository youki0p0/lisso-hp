# LISSO Project Preparation Kit

This repository is a preparation package for building the LISSO web ecosystem.

## Projects

- **LISSO Home**: Corporate website for Shisha Division and Technology Division.
- **ShishaOS**: Shisha flavor inventory, mixology recommendation, sensory database, and recipe sharing app.
- **LISSO EC**: Self-hosted ecommerce service connected to ShishaOS and product inventory.
- **Cloud Run API**: Backend API for AI recommendation, recipe conversion, admin operations, and integrations.

## Philosophy

LISSO is a company that designs experiences.

- Shisha Division: designs aroma and taste.
- Technology Division: designs infrastructure, security, and business improvement.

## Recommended Stack

- Frontend: Next.js App Router / TypeScript / Tailwind CSS
- Hosting: Vercel
- Backend: Google Cloud Run
- Database: Cloud SQL PostgreSQL
- Storage: Google Cloud Storage
- ORM: Prisma
- Auth: NextAuth or Firebase Auth
- AI: Claude / OpenAI abstraction layer

## How to use

1. Push this repository to GitHub.
2. Give the contents of `docs/`, `.claude/`, and `prompts/` to Claude Design and Claude Code/Fable.
3. Start implementation from `apps/lisso-home`, `apps/shisha-os`, and `apps/cloud-run-api`.
4. Keep all design decisions aligned with `.claude/design_principles.md`.

