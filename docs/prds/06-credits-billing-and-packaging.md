# Credits, Billing, And Packaging

## Goal

Monetize soon after trust is earned by converting guests into users who purchase credit packs for ongoing remodel generations.

## MVP scope

- Credit-pack definitions and seed data
- Checkout initiation through Polar
- Webhook handling and fulfillment
- Credit ledger entries for grants, purchases, generations, and refunds
- Purchase-aware gating in generation flows

## Requirements

- Billing state should be based on ledger entries and provider events, not only a mutable balance field
- The checkout flow should map purchases to the correct user account after conversion
- Complimentary trial usage should not create misleading paid-credit records
- The app should support clear starter-pack upsell messaging immediately after the free result

## Recommended pack posture

- Starter pack for the first paid continuation after trial
- Mid-tier pack for a concentrated weekend project
- Larger pack for whole-home exploration or repeated revisions

## Task breakdown

- Finalize pack pricing and credit counts
- Build checkout handoff and return routes
- Add webhook validation and idempotent fulfillment
- Record credit ledger entries for purchases and generation spend
- Build billing UI for pack history and current balance

## Acceptance criteria

- A converted user can buy a pack and continue generating immediately
- Credit balance changes are explainable through ledger entries
- Refunds or manual adjustments can be represented without corrupting history

## Non-goals

- Subscription-first monetization
- Enterprise invoicing
