# v0.2 changelog

## Customer experience

- Added rich venue-zone selection and zone-aware table choice.
- Upgraded floor plans with customer filters, table types, access information, sightlines and eight layout presets.
- Added Watch Tonight with screen schedules, control rules, requests, reminders, better-table guidance and local phone audio.
- Split ordering into Food, Drinks, Group round, My order and Collection.
- Added staff-controlled alcohol review, identified group participants and decline alternatives.
- Made Table Service persistent and routed requests to venue functions.
- Made Home respond to visit stage and venue-local Tonight context.
- Expanded Ask Star into deterministic multi-step workflows.
- Added marketing explanations and controls, phone receptionist scenarios, richer rewards and collection state.
- Added a 16-step guided presentation and local SVG QR code.

## Engineering

- Extended strict domain types for zones, layouts, entertainment, drink review, service, marketing, calls, collection and presentation.
- Split fixtures into focused domains and expanded cross-reference validation.
- Added persistence version 2 with a safe v0.1 migration on the existing key.
- Added nested routes and lazy page chunks while keeping global service surfaces mounted.
- Added unit coverage for fixture and transition rules and Playwright coverage for the principal v0.2 journeys on mobile and desktop.
- Kept the GitHub Pages base and deployment workflow unchanged.

## Safety and privacy

- All new data and screenshots are synthetic.
- Alcohol, serious allergies and urgent assistance retain visible human routes.
- Regulated gaming functionality and gaming-derived personalisation remain excluded.
- No production integrations, secrets, private images or real personal/venue data were added.

## Compatibility

Persisted v0.1 browsers migrate automatically. To reset manually, choose **Reset demo** or delete `star-local-demo-v1` from localStorage and reload.
