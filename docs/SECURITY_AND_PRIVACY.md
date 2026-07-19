# Security and privacy

## Public repository boundary

This repository contains only source code, original interface work, public documentation and wholly synthetic data. The supplied design PDF, embedded reference screenshots, real venue imagery and operational material remain private inputs and are excluded from the repository.

Never commit real customer or employee information, credentials, membership numbers, phone numbers, dates of birth, addresses, payment details, venue layouts, transport routes, stock data, gaming data, RSA decisions, exclusions, security incidents, secrets or private company assets.

## Runtime data flow

- Runtime state stays in the browser and no telemetry or analytics are sent.
- There are no API keys, environment variables, remote data sources or backend endpoints.
- Persistence is limited to `star-local-demo-v1`; persistence version 2 safely migrates older prototype state.
- Reset rebuilds synthetic defaults. Deleting the localStorage key removes all persisted demo state.
- Ask Star is a local deterministic intent catalogue, not a live AI model.
- Phone audio, receptionist transcripts and the QR graphic are generated locally.

## Public-data safeguards

- All exported fixture entities carry `synthetic: true` and pass reference validation.
- No private or third-party images ship in the bundle; documentation screenshots are captured from the synthetic implementation.
- Marketing fixtures enumerate their permitted basis and explicitly exclude gaming, RSA, security, exclusion and accessibility records.
- Memory controls let the synthetic customer inspect, pause, edit or remove remembered preferences.
- There is no hidden personalised pricing or background location tracking.

## Safety-sensitive boundaries

- **Alcohol:** customer input creates a request for staff review; venue staff may accept, modify or decline. The prototype makes no intoxication, age or legal-compliance decision and never supplies alcohol.
- **Allergies:** serious-allergy questions transfer to a human and no allergen-free guarantee is made.
- **Transport:** only the customer's own broad window or approximate ETA is visible; no other passenger, address, stop, route or continuous GPS movement appears.
- **Gaming:** no reservations, controls, cashless functionality, recommendations, marketing or activity data are implemented.
- **Collection:** the customer initiates a fabricated reservation and age/supply confirmation remains at the collection counter.
- **Payments and check-in:** visual simulations never charge, authenticate, scan or locate anyone.

## Review before publication

Inspect all staged names and diffs, scan for secrets and real identifiers, run fixture validation and browser safety tests, confirm the Pages base, and ensure only synthetic screenshots are committed. If a real secret is ever committed, rotate it immediately; deleting it from a later commit is insufficient.
