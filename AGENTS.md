# Codex Project Instructions

These instructions apply to all work in this repository.

## Project status

This repository is an unofficial, public, front-end concept prototype. It is a meeting demonstration, not a production hospitality, loyalty, liquor, transport or gaming system.

## Core objective

Build a polished mobile-first prototype that demonstrates how a member could coordinate an entire venue visit through one experience: booking, seating, ordering, rewards, courtesy transport, entertainment requests and customer-controlled personalisation.

## Mandatory boundaries

- Use only synthetic fixture data.
- Do not add a production backend.
- Do not connect live payment, location, telephony, AI, gaming, booking, POS or venue systems.
- Do not add real company screenshots, employee details, customer records, QR credentials or internal venue information.
- Do not claim the prototype is endorsed by or connected to Star Group.
- Do not implement personalised gambling promotion or use gaming behaviour for hospitality recommendations.
- Treat alcohol, allergies, gaming and transport as simulated interface states with clear human or regulated-system boundaries.

## Preferred implementation

- React + TypeScript + Vite
- Mobile-first responsive layout
- Static fixture data under `src/fixtures/`
- Deterministic scripted assistant interactions
- Local client state and optional `localStorage`
- Accessible semantic components
- GitHub Pages-compatible build
- Tests for the flagship demonstration flow

## UX priorities

1. The current visit and next useful action should dominate the home screen.
2. Preserve visible access to human assistance.
3. Separate venue, zone, table and customer context.
4. Explain personalised offers and allow immediate preference control.
5. Never expose other courtesy-bus passengers or stops.
6. Use honest simulated states rather than fake precision.
7. Every important action must also be possible without conversational AI.

## Development workflow

- Read the design document in `docs/` before implementing major features.
- Keep components reusable and fixture-driven.
- Prefer small, reviewable commits.
- Run formatting, type checking and tests before completion.
- Document deliberate prototype shortcuts in the README rather than disguising them as production readiness.
