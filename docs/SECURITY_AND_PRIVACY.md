# Security and privacy

## Public repository boundary

This repository must contain only source code, original UI, public documentation and wholly synthetic fixture data. The supplied design PDF, embedded screenshots, venue photographs and operational references are private inputs and are excluded by `.gitignore`.

Never commit real customer or employee information, QR or barcode credentials, membership numbers, phone numbers, birth dates, addresses, payment details, venue layouts, bus routes, stock data, gaming information, RSA decisions, exclusions, security incidents, secrets or private company assets.

## Data flow

- Runtime data never leaves the browser.
- The prototype sends no telemetry or analytics.
- There are no API keys, environment variables or backend endpoints.
- Persistence is limited to a versioned localStorage demo state and can be cleared with **Reset demo**.
- The assistant is a local regular-expression intent catalogue, not a live AI model.

## Safety-sensitive states

- **Alcohol:** always marked for staff confirmation; no BAC estimate, intoxication decision or legal-compliance claim.
- **Allergies:** distinct from preferences, dietary choices and intolerance; staff confirmation is required and no allergen-free guarantee is made.
- **Transport:** broad windows before approach, approximate ETA during approach, and no other passenger, address, stop, full route or continuous GPS movement.
- **Gaming:** no controls, recommendations or activity data. The hidden fictional gaming zone is never a customer-visible recommendation input.
- **Payments and check-in:** explicit simulations that never charge, scan, authenticate or locate a person.

## Secret and asset review

Before merging, inspect staged file names, run the automated test suite, and confirm every asset is necessary and publishable. If a real secret is ever committed, rotate it immediately; deleting the file is not sufficient.
