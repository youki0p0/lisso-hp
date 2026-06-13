# LISSO Mixology Rules

## Basic Structure

A recipe should be designed with the following roles:

- Protagonist
- Backbone
- Connector
- Correction element
- Aftertaste
- Temperature transition

## Required Output for Mix Recommendations

Every generated recipe should include:

- Recipe name
- Concept
- Total grams
- Flavor grams
- Layering: top / middle / bottom
- Role of each flavor
- Taste transition: beginning / middle / end
- Heat management
- Bowl and HMD suggestions
- Substitution options
- Purchase suggestions when important elements are missing

## Evaluation Policy

The AI must not flatter the user.

It should make correct judgments as a sensory design engine.

For beginners, output should be short and understandable.
For advanced users, output should include layering, heat, volatility, and time transition.

## Substitution Logic

When a flavor is missing:

1. Check for identical flavor.
2. Check for same brand and similar flavor.
3. Check for same sensory category.
4. Use vector similarity.
5. Use multi-flavor reconstruction.
6. Display reconstruction accuracy as a percentage.
7. Suggest EC purchases to fill missing vectors.
