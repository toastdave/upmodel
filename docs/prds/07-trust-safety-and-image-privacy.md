# Trust, Safety, And Image Privacy

## Goal

Make users comfortable uploading photos of their homes by handling storage, moderation, and privacy with clarity and restraint.

## MVP scope

- Image storage rules and retention posture
- Basic moderation hooks for uploaded photos and generated results
- Private-by-default project access
- Clear communication around guest data and post-conversion migration

## Requirements

- Uploaded home images must never be exposed publicly by default
- Guests should understand that their work can be preserved if they convert
- The app should be able to flag or block unsafe uploads or outputs if providers surface issues
- Internal logs and debugging metadata should avoid leaking sensitive home details unnecessarily

## Task breakdown

- Define storage key patterns and signed-access strategy
- Add moderation status fields and review hooks
- Write privacy copy for upload and conversion moments
- Add retention rules for abandoned guest sessions and assets
- Review webhook, media, and internal processing endpoints for access control

## Acceptance criteria

- Source photos and generated outputs are private to the current viewer context
- Guest data lifecycle is documented and predictable
- Moderation outcomes can be recorded without breaking the project workflow

## Non-goals

- Heavy manual review tooling in the first pass
- Public social features around user homes
