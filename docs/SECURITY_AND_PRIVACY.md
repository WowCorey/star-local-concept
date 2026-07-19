# Security and privacy

## Public repository boundary

This repository contains only source code, original interface work, public documentation and wholly synthetic data. The supplied design PDF, embedded reference screenshots, real venue imagery and operational material remain private inputs and are excluded from the repository.

Never commit real customer or employee information, credentials, membership numbers, phone numbers, dates of birth, addresses, payment details, venue layouts, transport routes, stock data, gaming data, RSA decisions, exclusions, security incidents, secrets or private company assets.

## Runtime data flow

- Runtime state stays in the browser and no telemetry or analytics are sent.
- There are no API keys, environment variables, remote data sources or backend endpoints.
- Persistence is limited to `star-local-demo-v1`; persistence version 3 safely migrates older prototype state and replaces a table hidden by an active layout.
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

## State-authority boundary

Customer-facing controls can submit or cancel a request, select an alternative, respond to the current synthetic participant's own item, reserve a collection before preparation, and request human help. They cannot self-declare alcohol approval, venue age confirmation, order preparation or delivery, service acceptance or completion, collection readiness or completion, or television approval.

Demo Controls and deterministic presentation presets are the only UI surfaces that simulate those venue-controlled outcomes. This separation does not claim production authorization or authentication; it makes the concept's intended trust boundary visible and testable.

Phone-call fixtures store their ordered transcript and structured outcome together. The summary is rendered from the outcome that mutates local visit state. Allergy transfer writes no booking or safety claim and preserves both the current visit and already-displayed transcript.

Modal surfaces move and contain keyboard focus, restore the triggering control, and make background content inert. Escape closes non-urgent dialogs. Urgent assistance views require a clear warning and explicit close action while the request remains active.

## Review before publication

Inspect all staged names and diffs, scan for secrets and real identifiers, run fixture validation and browser safety tests, confirm the Pages base, and ensure only synthetic screenshots are committed. If a real secret is ever committed, rotate it immediately; deleting it from a later commit is insufficient.
