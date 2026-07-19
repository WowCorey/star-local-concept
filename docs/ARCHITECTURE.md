# Architecture

## Runtime boundary

Star Local v0.2.1 is a static, browser-only React application:

```text
AppShell
  ├─ HashRouter → lazy page chunks
  ├─ global overlays → Ask Star, Table Service, phone, presentation, demo controls
  ├─ Zustand demo store → explicit transitions → localStorage
  └─ demoRepository → typed synthetic fixtures
```

There is no server, database, authentication, telemetry, live AI or third-party venue integration. The only production request is for the static Pages bundle itself.

## Routing and presentation shell

`HashRouter` preserves deep navigation on GitHub Pages without a custom 404. The Vite base remains `/star-local-concept/`. Visit and Order use nested routes so direct links remain understandable:

- `/visit/zones`, `/visit/floor-plan`, `/visit/watch`
- `/order/food`, `/order/drinks`, `/order/group`, `/order/status`, `/order/collection`

Page modules are lazy loaded behind an accessible route status. The shell, primary navigation and global service surfaces remain mounted so a visit state can continue across routes. Vite splits the larger route families into cacheable chunks.

On wide screens the app appears inside a bounded mobile frame beside presenter context and a locally rendered SVG QR code. On narrow screens it becomes the full viewport. The frame height is viewport-bounded so the sticky primary navigation never obscures actions.

## Domain boundaries

The v0.2 fixture model is divided by responsibility:

- `venues.ts` — venue identity, service capability, rich zone metadata and screen metadata
- `layouts.ts` and `layoutPresets.ts` — synthetic table geometry and event-specific transformations
- `entertainment.ts` — events and screen schedules
- `menus.ts` and `drinks.ts` — food and separate drink products
- `operations.ts` — service teams, campaigns, bottle-shop items and phone-call scenarios
- `presentation.ts` — guided meeting sequence
- `personas.ts` and `group.ts` — synthetic customer-controlled preferences and participants

Pages query fixtures through `demoRepository`; they do not embed authoritative arrays. This makes the static repository a replaceable boundary for a future approved API.

## State and migration

`demoStore.ts` models visit, booking, table, layout, ride, food, drink review, group acceptance, screen request, phone audio, service request, marketing, collection, phone call, rewards and presentation state as named TypeScript unions.

The persistence key intentionally stays `star-local-demo-v1` so existing browsers can upgrade in place. Zustand persistence version `3` runs `migrateDemoState`, which:

1. starts from the complete v0.2 defaults;
2. preserves recognised v0.1 values;
3. derives the correct venue zone, table and layout where older fields are missing;
4. merges nested drink, collection and preference records; and
5. clears transient sheets and notices so hydration cannot trap the interface.

Migration also validates the selected table against the selected zone and active layout preset. If a preset hides it, the first visible table in that zone becomes the discreetly announced fallback.

Unknown or missing records fall back to synthetic defaults. Reset rebuilds the full initial object.

## Operating rules

- A selected zone restricts table and screen choices.
- A layout preset can move, join or hide tables without changing their stable identity.
- A table's sightline IDs determine which screens are plausibly visible.
- Locked screens cannot be requested; scheduled screens expose their programme; requestable screens accept a local request.
- Food confirmation and drink review are separate state machines.
- Alcohol items never bypass `staff-review`; a staff-controlled decline produces non-alcoholic alternatives.
- Group-round items are assigned to identified synthetic participants with independent acceptance states.
- Table Service maps request kinds to venue-function fixtures such as Bistro Team or Duty Manager.
- The simulated telephone receptionist writes a confirmed booking and optional ride into the same store; serious-allergy questions enter `human-transfer`.

## Customer and presenter authority

Customer surfaces expose intent only: request, submit, cancel before preparation, choose an alternative, acknowledge the current participant's assigned item, or ask for a person. They do not expose transitions that claim venue approval, age confirmation, preparation, delivery, staff acceptance or arrival, collection readiness or completion, or television approval.

Operational transitions live in Demo Controls and presentation presets. This is an explicit prototype authority boundary: the customer creates or withdraws a request, while the presenter simulates the venue response. Store transition helpers used by Demo Controls are not presented as customer capabilities.

Phone scenarios contain ordered speaker turns and one structured outcome. Both the confirmation summary and the completed booking, table, layout and ride mutation read from that outcome, so displayed and written state cannot drift. A human transfer retains the transcript and does not mutate the visit.

Ask Star, Demo Controls, Table Service and Phone Receptionist share one modal-focus implementation. It moves focus into the dialog, traps focus, makes the background inert, closes non-urgent dialogs with Escape and restores the trigger. Urgent assistance requires an explicit acknowledgement before its view closes.

## Performance and dependencies

The implementation uses React, React Router, Zustand, Lucide and a small QR component. It adds no UI framework, remote font, animation library, image bundle, video or runtime service. Route splitting keeps the initial presentation shell separate from larger Visit and Order experiences.

## Intentionally absent

Production authentication, payments, alcohol supply, booking/POS/phone integration, continuous transport tracking, geolocation, staff operations, analytics, live AI, real venue-layout editing and all gaming controls are outside this architecture.
