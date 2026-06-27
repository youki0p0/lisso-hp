# Vercel / GCP Plan

## Vercel

Use Vercel for:

- lisso-home
- shisha-os frontend
- lisso-ec frontend
- OGP pages
- public pages

## GCP

Use GCP for:

- Cloud Run API
- Cloud SQL PostgreSQL
- Cloud Storage
- Secret Manager
- Cloud Logging

## API responsibilities

- AI recommendation
- Flavor vector parsing
- Recipe conversion
- Purchase recommendation
- Admin operations
- EC product linkage

## Security Notes

- Store API keys in Secret Manager or Vercel environment variables.
- Never expose AI API keys to frontend.
- Admin routes require strong authentication.
- Keep audit logs for human verification and AI output approval.
