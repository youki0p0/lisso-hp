# Architecture Guidance for Claude

Use this repository as a multi-application project.

Recommended structure:

```txt
apps/
  lisso-home/
  flavor-os/
  lisso-ec/
  cloud-run-api/
docs/
database/
prompts/
brand/
ops/
```

## Responsibilities

### lisso-home

Corporate website for both Shisha and Technology divisions.

### flavor-os

Main application for inventory, mixology, recipe sharing, admin, and AI recommendations.

### lisso-ec

EC frontend or integration layer.

### cloud-run-api

Backend APIs for AI, database operations, recommendation logic, and integrations.

## Rule

Do not hardcode temporary decisions without documenting them.
