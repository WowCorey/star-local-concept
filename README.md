# Star Local Concept

**An independent, unofficial prototype for an AI-enabled hospitality member experience.**

Star Local is a polished, mobile-first meeting showpiece that demonstrates one proposition:

> Tell the venue what kind of night you want, and the system coordinates the visit around you.

The prototype makes a complete hospitality journey tangible across booking, seating, ordering, group coordination, courtesy transport, screen requests, rewards, service, accessibility and customer-controlled personalisation.

![Star Local desktop presentation showing the synthetic Alex Morgan flagship journey](docs/screenshots/home-desktop.png)

_Original prototype capture. All visible people, venues, times, balances and service states are synthetic._

## Important status

- This is a **concept prototype**, not a production product.
- It is **not an official Star Group product** and is not connected to, approved by, sponsored by or endorsed by Star Group.
- All people, venues, tables, layouts, menus, prices, events, promotions, rewards, routes and service states are **fabricated**.
- It does not process real bookings, payments, alcohol orders, loyalty records, identities or transport requests.
- It has no backend and makes no live AI, POS, booking, payment, location, bus, phone, gaming or venue-system calls.

## Experience

The six destinations keep the current or next customer action prominent:

- **Home** - contextual next action and the Tonight timeline
- **Visit** - venue, booking, customer-safe floor plan, table and check-in
- **Order** - venue-local menu, specials, modifications, group order and simulated split payment
- **Ride** - inbound and return windows plus a privacy-preserving staged tracker
- **Rewards** - fabricated points, draw entries, vouchers and a non-functional demo card
- **Me** - memories, communications, accessibility, service requests and prototype status

**Ask Star** is a deterministic, scripted assistant. It converts a supported phrase into a visible structured result before updating any demo state and always keeps human help available.

## Three deliberately different journeys

- **Alex Morgan / Harbour Family Hotel** - the flagship Thursday family visit, Table 23, a barbecue-base parmigiana, Cowboys viewing and courtesy transport
- **Jordan Lee / Northside Sports Hotel** - an event-led Sports Bar visit with UFC, Broncos, group tables and later food
- **Taylor Smith / Hinterland Local** - an accessibility-led community visit with a low table, step-free path, trivia and accessible courtesy-bus capacity

Open **Demo Controls** to load any journey, move the simulated clock, change venue or persona, and adjust booking, order, ride, kitchen, service, staff-review and sold-out states. **Reset demo** restores Alex's flagship scenario and persisted state.

## Local setup

Requirements: Node.js 22.12 or newer. CI and deployment use Node.js 24.

```bash
npm install
npm run dev
```

Vite prints the local address. All runtime data comes from local TypeScript fixtures and persists under the browser key `star-local-demo-v1`.

## Commands

```bash
npm run dev          # development server
npm run build        # strict TypeScript build and Vite production bundle
npm run preview      # preview the production build
npm run lint         # ESLint
npm run typecheck    # strict TypeScript checks
npm run test         # Vitest unit and component tests
npm run test:e2e     # Playwright mobile and desktop journeys
npm run format:check # Prettier drift check
```

For a first local Playwright run:

```bash
npx playwright install chromium
npm run test:e2e
```

## GitHub Pages deployment

`vite.config.ts` sets the production base path to `/star-local-concept/`. The deployment workflow builds `dist`, uploads a Pages artifact and deploys it after a push to `main`.

Expected URL: <https://wowcorey.github.io/star-local-concept/>

Repository administrators may need to set **Settings -> Pages -> Build and deployment -> Source** to **GitHub Actions** once. No environment variables or secrets are required.

## Project structure

```text
src/
  app/          Router and presentation shell
  components/   Reusable accessible UI primitives
  features/     Scripted assistant and presenter controls
  fixtures/     Typed synthetic members, venues, layouts and menus
  pages/        Six primary destinations and the floor-plan flow
  services/     Deterministic fixture repository and mock delays
  state/        Persisted demo state and explicit transitions
  styles/       Design tokens, responsive presentation frame and components
  types/        Domain models
tests/e2e/      Principal Playwright journeys
docs/           Architecture, demo, fixtures, accessibility, privacy and safety
```

## Safety and fixture rules

Every exported top-level fixture includes `synthetic: true`. Fixture validation checks cross-entity references. Gaming areas are not customer-visible recommendation inputs. Alcohol and allergy states require human confirmation. Ride status never reveals another passenger, address, stop, full route or precise continuous movement.

Do not commit the private design-document PDF, its screenshots, reference photographs, real venue layouts, real identifiers or extracted company assets. See [Public Data and Asset Rules](docs/PUBLIC_DATA_AND_ASSET_RULES.md) and [Security and Privacy](docs/SECURITY_AND_PRIVACY.md).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Meeting demo guide](docs/DEMO_GUIDE.md)
- [Fixture data](docs/FIXTURE_DATA.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Security and privacy](docs/SECURITY_AND_PRIVACY.md)
- [Public data and asset rules](docs/PUBLIC_DATA_AND_ASSET_RULES.md)

## Known limitations

- All service latency and outcomes are deterministic client-side simulations.
- Payment, check-in, digital card, phone audio, alcohol ordering, allergy escalation, bottle-shop collection and transport are representational only.
- The assistant recognises a small, documented intent catalogue and is not a language model.
- The floor plans are original simplified geometry, not operational maps.
- Production authentication, consent records, integrations, regulated workflows, analytics and staff tools are intentionally excluded.
