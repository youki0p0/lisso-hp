# ShishaOS Admin Requirements

ShishaOS requires an internal admin panel.

## Admin Routes

```txt
/admin
/admin/flavors
/admin/brands
/admin/recipes
/admin/inventory
/admin/products
/admin/ai-review
/admin/substitutions
```

## Flavor Management Flow

1. Admin enters a natural-language sensory evaluation.
2. AI parses it into structured fields:
   - taste_vector
   - tags
   - roles
   - good_with
   - avoid
   - substitution_candidates
   - mixology_notes
3. Admin reviews and edits the AI output.
4. Admin approves it as human_verified.
5. Admin publishes it for use in recommendations.

## Status Model

```txt
draft
ai_parsed
human_verified
public
archived
```

## Important Policy

AI output must not be used directly in production recommendation logic unless it has been human verified.

LISSO's sensory judgment is the source of truth.
