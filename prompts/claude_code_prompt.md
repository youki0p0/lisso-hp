# Claude Code / Fable Implementation Prompt

Build the LISSO web ecosystem using the documents in this repository as the source of truth.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel
- Google Cloud Run
- Cloud SQL PostgreSQL
- Prisma
- Google Cloud Storage
- AI provider abstraction layer

## Applications

- apps/lisso-home
- apps/flavor-os
- apps/lisso-ec
- apps/cloud-run-api

## First Milestone

Create a working MVP with:

1. Corporate top page with Shisha and Technology division split.
2. Flavor OS landing page.
3. Flavor inventory admin UI.
4. Natural-language sensory evaluation input.
5. AI parse review screen with editable taste vector.
6. Human verification status flow.
7. Basic user inventory screen.
8. Basic mix recommendation mock API.
9. Shared recipe page.

## Important Policies

- AI must not invent final flavor data from names alone.
- AI can parse user sensory descriptions into structured data.
- Admin approval is required before data is public.
- Keep UI consistent with `.claude/design_principles.md`.
