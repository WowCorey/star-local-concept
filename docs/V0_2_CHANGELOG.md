# v0.2 changelog

## v0.2.1 immersion and state-authority correction

- Removed presenter-only drink decisions, participant operational states, Table Service progression and bottle-shop preparation progression from customer screens; added complete operational controls to Demo Controls.
- Rebuilt phone scenarios as ordered turns plus a structured outcome shared by the displayed summary and state mutation. Harbour and UFC calls now write their full venue, zone, table, party, arrival, layout and ride outcome; allergy calls preserve the visit and transcript while transferring to a person.
- Made presentation setup executable and deterministic, including automatic Table Service and Phone Receptionist opening and feature preloads for drink, screen, phone audio and venue-switch steps.
- Rendered joined-table presets with a shared boundary, combined capacity and individually identifiable tables; hidden selected tables now receive a safe visible-table fallback.
- Stored “Add water for everyone” as a real zero-cost group add-on visible across round, order and progress views.
- Expanded Home next-action inputs and priority across booking validity, venue transport capability, visit stage, group/order, screen, return ride and service state.
- Added reusable focus entry, trapping, background inertness and trigger restoration to all dialogs, with guarded dismissal for urgent assistance.
- Added regression coverage for customer/presenter authority, structured phone outcomes, transcript preservation, presentation setup, joined layouts, hidden-table fallback, water state, Home priority and dialog focus.

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
- Added persistence version 3 with safe migration on the existing key.
- Added nested routes and lazy page chunks while keeping global service surfaces mounted.
- Added unit coverage for fixture and transition rules and Playwright coverage for the principal v0.2 journeys on mobile and desktop.
- Kept the GitHub Pages base and deployment workflow unchanged.

## Safety and privacy

- All new data and screenshots are synthetic.
- Alcohol, serious allergies and urgent assistance retain visible human routes.
- Regulated gaming functionality and gaming-derived personalisation remain excluded.
- No production integrations, secrets, private images or real personal/venue data were added.

## Compatibility

Persisted v0.1 and v0.2 browsers migrate automatically. To reset manually, choose **Reset demo** in Demo Controls or delete `star-local-demo-v1` from localStorage and reload.
