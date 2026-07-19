# Meeting demo guide

## Recommended seven-minute journey

1. Open the public link and identify the permanent **Unofficial concept** and synthetic-data notices.
2. On Home, show Alex's next action and **Tonight at Harbour Family Hotel**. Explain that Home changes across before-visit, approaching, in-venue and after-visit stages.
3. Open **Visit → Choose Zone**. Compare the Bistro with the Sports Bar: atmosphere, access, table types, service model, entertainment, demand and screens all differ.
4. Choose Bistro, then **Choose a Bistro table**. Use the filter chips, select Table 23 and call out its complete text alternative, step-free route and Screen 7 sightline.
5. In Demo Controls change the layout preset. Show that event conditions can move, join or hide synthetic tables without exposing operational data.
6. Open **Watch Tonight**. Contrast the locked main wall, scheduled content and requestable Screen 7. Request the Cowboys game, then start and pause the local phone-audio simulation.
7. Open **Order → Food**, choose the chicken parmigiana and apply Alex's reviewable usual. Confirm it, then switch to **Drinks** and submit a lager for staff review.
8. Open **Group round**. Assign an item to a named participant and respond only to Alex's own item. Add water for everyone and show the persisted zero-cost line. Use Demo Controls to demonstrate other participant and delivery outcomes.
9. Check in from Visit. Open the persistent **Table Service** control and request sauce. Point out that the customer can cancel or ask for a person, then use Demo Controls to progress the venue response through requested, accepted, on the way and completed.
10. Finish with **Rewards** and **Me**: show fabricated activity, wallet, receipt history, marketing controls and remembered preferences that can be paused, edited or removed.

## Proving venue-local behaviour

Load **Sports night** from Demo Controls:

- Jordan and Northside replace Alex and Harbour throughout the shell.
- The UFC main card, Arena Screen 1, event-led products and Sports Bar tables appear.
- Locked main-card content cannot be overridden; suitable secondary content can be requested.
- The group-round product options change to Northside's synthetic drink range.

Load **Accessibility**:

- Taylor and Hinterland appear with a low Table 4 and step-free route.
- Higher text size and reduced motion demonstrate customer preferences without medical data.
- The venue's collection route shows a token only after the customer reserves the fabricated item.

## Phone receptionist

Choose **Phone reception** in Demo Controls. Continue the disclosed automated transcript through identification, details and confirmation. The usual-table scenario creates a Bistro Table 23 visit and family-bus request. The UFC scenario creates a Northside plan. The serious-allergy scenario stops at a human transfer rather than answering the safety question.

## Ask Star examples

- “Plan our usual Thursday” creates a structured visit proposal.
- “When is the bus arriving?” explains the customer's own approximate ride state.
- “Can we watch the Cowboys?” proposes only a suitable requestable screen.
- “Order my usual” keeps food reviewable before confirmation.
- “We need urgent help” routes immediately to a human function.

Ask Star is deterministic and never represents itself as live AI.

## Recovery and reset

- Escape closes non-urgent Ask Star, Demo Controls, Table Service and phone dialogs, then restores their trigger. Urgent assistance shows a warning and keeps the request active.
- Escape exits presentation mode when no presentation-opened dialog is active.
- **Demo Controls → Reset demo** restores the complete flagship state.
- For a hard reset, remove `star-local-demo-v1` from localStorage and reload.
- State selectors can repair individual booking, order, ride, screen, service, phone and collection conditions during a meeting.

Everything in this guide is fabricated and runs locally in the browser.
