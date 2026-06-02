# Journée opening wizard — product decisions

Canonical order follows the Figma screenshots provided (image order), not inconsistent step labels in mockups.

## Wizard steps (in-app)

1. Configuration — `pages/configuration-step1/` (route `configuration-step1`)
2. Index pistolets — `pages/index-pistoles-step2/` (route `index-pistoles-step2`)
3. Bons lavage — `pages/bon-lavage-step3/` (route `bon-lavage-step3`)
4. Bons vidange
5. Encaissements non-espèces
6. Dépenses
7. Validation

## Deferred (not in v1 wizard)

- Stocks cuves
- Dettes
- Recharges

These may be added between Dépenses and Validation in a later release.

## Lifecycle

- **Ouverture wizard:** captures opening data (indexes, declarations, cash movements) at shift start.
- **Clôture:** separate flow later; `shift_reading.end_index` filled at close.
- Statuses: `brouillon` → `en_cours` → `soumise` → `cloturee`
- Only one `en_cours` journée per station at a time.

## Lavage POS (Screen 5)

- **Not** a wizard step.
- Lives under `features/lavage/` (sidebar module).
- Wizard step 3 is batch **declaration** of bons; POS creates bons during the day.
