# Fixture data

## Standard

All top-level entities are explicitly marked `synthetic: true`. Names, identifiers, combinations of preferences, balances, events, layouts, products and prices were created for this prototype and must not be replaced with lightly edited real records.

Fixture validation checks that:

- every top-level entity is synthetic;
- persona venue references exist;
- venue layouts exist;
- menu references resolve; and
- customer-visible venue zones exclude the fictional regulated gaming area.

## Entity groups

- `personas.ts` - Alex Morgan, Jordan Lee and Taylor Smith, including permissions and editable memories
- `venues.ts` - three fictional venues with local zones, screens, services and events
- `layouts.ts` - authored customer-safe geometry for Thursday draw, UFC and accessible trivia contexts
- `menus.ts` - permanent items, venue-local specials, stock states and representational products
- `group.ts` - fictional Table 23 group-order participants

## IDs and addresses

Identifiers use clear demo forms such as `DEMO-10482`, `table-23` and `harbour-parmi`. No fixture includes a street address, phone number, date of birth, valid credential, payment detail or real route. If email data is added later, use an approved reserved example domain and keep `synthetic: true`.

## Time

The UI reads simulated day and time from Demo Controls. Time-sensitive menu and event copy must never depend on the viewer's actual date or location.

## Adding fixtures

1. Confirm the full record is fabricated.
2. Add `synthetic: true`.
3. Keep venue-local information local; do not create accidental group-wide defaults.
4. Add or extend fixture validation.
5. Run `npm run test` and the relevant Playwright journey.
