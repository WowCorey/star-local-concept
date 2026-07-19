# Contributing

This project is currently a controlled concept build.

## Before making changes

1. Read `README.md`.
2. Read `AGENTS.md`.
3. Read `docs/PUBLIC_DATA_AND_ASSET_RULES.md`.
4. Confirm that every proposed data value and asset is safe for a public repository.

## Branch and pull-request workflow

Use a short-lived feature branch for implementation work. Suggested branch names:

- `prototype/foundation`
- `prototype/flagship-journey`
- `feature/ride-tracker`
- `feature/venue-floor-plan`
- `fix/accessibility-navigation`

Pull requests should explain:

- what changed;
- which prototype journey it supports;
- what is intentionally simulated;
- screenshots or recordings using synthetic data only;
- tests run; and
- any known prototype limitations.

## Quality expectations

Even though this is a showpiece rather than a production system, it should have:

- no broken primary navigation;
- no console errors in the standard demo flow;
- usable mobile and desktop presentation layouts;
- keyboard-accessible core controls;
- readable contrast and focus states;
- deterministic demo behaviour;
- clear loading, empty, success and failure states; and
- no accidental claims that simulated actions are real.

## Security and privacy

Never report or demonstrate a security issue using real personal data. Do not commit secrets. If a secret is accidentally committed, treat it as compromised and rotate it rather than merely deleting the file.
