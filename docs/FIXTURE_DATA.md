# Fixture data

## Standard

Every exported top-level fixture is wholly fabricated and marked `synthetic: true`. Names, identifiers, preference combinations, balances, layouts, products, prices, events, transcripts and states must never be derived from real customer or operational records.

Fixture validation checks synthetic flags, venue references, layout references, zone/table/screen relationships, menu and schedule integrity, and the exclusion of regulated areas from customer-visible zones.

## Domains

- `personas.ts` — Alex, Jordan and Taylor; permissions, accessibility, communications and editable memory
- `venues.ts` — three fictional venues, customer zones, service capabilities, screen rules and event context
- `layouts.ts` — original normalised table geometry with zone, access, atmosphere, type and sightline attributes
- `layoutPresets.ts` — weekday, draw, dinner, game, UFC, trivia, birthday and function transformations
- `entertainment.ts` — venue-local events and screen schedules
- `menus.ts` — food items, modifications, stock and preparation estimates
- `drinks.ts` — tap, wine, premix, cocktail, zero-alcohol and water items with size, price, stock and review requirements
- `group.ts` — identified synthetic round participants
- `operations.ts` — function-level service routing, marketing explanations, collection products and phone transcripts
- `presentation.ts` — the 16 guided presentation steps

## Stable IDs and relationships

IDs such as `table-23`, `north-screen-1`, `shop-pale-six` and `DEMO-10482` are obvious prototype identifiers. A table points to one venue and zone and may reference visible screen IDs. Schedules point to one venue screen. A campaign explicitly lists its permitted basis and excluded inputs.

No fixture includes a real street address, phone number, birth date, credential, payment detail, GPS route, venue floor plan, employee identity or valid membership record.

## Time and availability

The app reads only the simulated day and time in the store. It does not use the viewer's clock, location, weather or a live feed. Stock, wait times, schedules, request outcomes, reward results and service progress are presenter-controlled deterministic states.

## Adding fixtures

1. Fabricate the complete record and mark it `synthetic: true`.
2. Keep venue behaviour venue-local; do not create accidental group-wide defaults.
3. Use stable obvious demo IDs and resolve every foreign key.
4. Keep accessibility descriptive and preference-based; do not add diagnosis or medical history.
5. Never add RSA decisions, exclusion records, security incidents or gaming activity.
6. Extend fixture validation and relevant unit/Playwright coverage.
7. Run `npm run test`, `npm run typecheck` and the affected browser journeys.
