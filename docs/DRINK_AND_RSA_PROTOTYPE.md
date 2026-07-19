# Drink ordering and RSA boundary

## Purpose

The Drinks experience demonstrates how a customer-facing request can be coordinated without automating a Responsible Service of Alcohol decision.

## Flow

1. The customer views only the selected venue's synthetic drink range, stock label, sizes, prices and preparation estimate.
2. They select a product, size, participant and table.
3. Zero-alcohol items may progress as ordinary service requests.
4. An age-restricted item enters `staff-review` after submission.
5. A presenter-controlled venue outcome may accept, modify or decline the request.
6. A decline presents zero-alcohol alternatives and retains a clear human-help route.

No step estimates intoxication, verifies age, guarantees stock, calculates legal eligibility or supplies alcohol.

## Group rounds

Every selection is attached to an identified synthetic participant. Participants have independent pending, accepted, declined, staff-order, age-check and delivered states. The signed-in synthetic customer can accept or decline only their own assigned item; the customer interface cannot change another participant's response or any venue-controlled state. Water is stored as an explicit zero-cost round add-on and appears in Group Round, My Order and progress without changing drink-review status.

## Human control

The prototype uses functional team labels rather than invented employee identities. Customer actions stop at submit, cancel before review, choose a zero-alcohol alternative, or ask for staff. Alcohol acceptance, modification, decline, age checking, preparation and delivery are presenter actions in Demo Controls. Staff review remains visible in order status. Urgent or safety-sensitive assistance routes to the immediate-human function.

The same boundary applies beside drink ordering: customers cannot complete a service request, approve a television request, or advance bottle-shop preparation and collection. Those operational outcomes are simulated only by the presenter.

## Data boundary

Fixtures contain no RSA records, age documents, dates of birth, exclusion records, incident history, consumption history, gaming activity or real transactions. Marketing campaigns explicitly exclude RSA, security, exclusion, accessibility and gaming inputs.

## Not implemented

Real alcohol supply, POS integration, payment, age verification, identity checks, automated RSA assessment, consumption tracking, staff backend and production notifications are intentionally absent.
