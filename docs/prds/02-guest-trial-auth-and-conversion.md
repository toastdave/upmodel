# Guest Trial, Auth, And Conversion

## Goal

Make Upmodel very easy to try while pushing users into account creation and paid usage quickly after the first successful result.

## MVP scope

- Guest session creation and persistence
- One complimentary guest generation
- Clear usage wall after the guest result
- Combined sign-up and credit-pack purchase handoff
- Guest project migration into the created account after successful conversion

## Requirements

- Guests must be able to upload a room and receive one result without signing in first
- The complimentary allowance must be enforced server-side, not only in the UI
- The next regeneration, new project, or save action should trigger conversion
- Conversion should create the account and then continue into checkout without making the user rediscover their project
- Guest-owned records must migrate safely into the new account after purchase

## Recommended defaults

- One free guest generation only
- Conversion moment should happen on the second meaningful action, not after several rounds of free exploration
- Google, Apple, and email/password should be supported in the same conversion funnel
- The user should return to the same project after conversion succeeds

## Task breakdown

- Add guest session cookie management and backing records
- Define guest ownership rules for projects, uploads, briefs, and jobs
- Implement trial allowance checks around generation creation
- Build the combined auth-plus-checkout route and state handoff
- Migrate guest records and grant purchased credits on success
- Add copy and UI that explains why payment is required after the first free result

## Acceptance criteria

- A guest can get exactly one successful result without auth
- The second attempt reliably routes into conversion
- Successful conversion preserves the guest project and unlocks continued generation
- Failed checkout or auth does not lose the in-progress guest work

## Non-goals

- Anonymous unlimited browsing of prior projects
- Complex promotional discount systems in the first pass
