# Architecture

## Runtime boundary

Star Local runs entirely in the browser:

```text
React UI
  -> HashRouter (GitHub Pages-safe routes)
  -> Zustand demo state
  -> typed fixture repository
  -> deterministic mock delays
  -> localStorage
```

There is no database, server, production authentication, telemetry, secret, live AI service or venue-system integration.

## Design decisions

### Hash routing

`HashRouter` preserves deep navigation on GitHub Pages without a custom 404 rewrite. The Vite bundle still uses the required `/star-local-concept/` base path.

### Fixture repository boundary

Pages read venue, member, layout and menu data through `demoRepository`. The service exposes stable query methods and a few asynchronous mock actions. A future implementation can replace those contracts without embedding data arrays in page components.

### Explicit demo state

The Zustand store models booking, order, courtesy-bus, screen-request and service-request states as named unions. Actions such as `confirmVisit`, `checkIn`, `confirmRide`, `chooseOrder` and `resetDemo` make transitions inspectable and testable.

State persists to `localStorage` using the versioned key `star-local-demo-v1`. Overlay and notification visibility are cleared during persistence so a reload never traps a presenter in a sheet.

### Customer-safe floor plans

Layouts use normalised synthetic geometry with a list-view equivalent. The UI exposes capacity, access, family suitability, noise and nearby screens but never shows customer names, staff notes, conflicts or live operational availability.

### Controlled prototype depth

Visible actions change state convincingly while all results stay deterministic. Check-in never invokes a camera or location. Payment never creates a charge. The digital card uses a deliberately decorative non-scannable pattern. Bus timing becomes an approximate ETA only during the simulated approach stage.

## Product assumptions

- Alex's Wednesday invitation is the default state because it is the rehearsable flagship journey.
- A venue switch changes fixtures immediately; group-wide behaviour does not override venue-local menus, events, screens or transport.
- Accessibility preferences can change presentation and visit planning without collecting medical detail.
- A staff-review route is retained for alcohol, allergies, accessible transport and service problems.
- Gaming, exclusions, RSA decisions, security incidents and staff safety reports are outside the recommendation model and absent from fixtures.
