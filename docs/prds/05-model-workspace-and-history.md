# Model Workspace And History

## Goal

Make `/model` the durable product center where users can see their source photo, remodel brief, generation states, output variants, and conversion prompts in one coherent flow.

## MVP scope

- A primary `/model` route for guest and signed-in users
- Project list or active-project workspace state
- Result gallery with before/after context
- History and regeneration entry points for signed-in paid users
- Clear upsell messaging at the right moments

## Requirements

- Guests should understand what is free and what requires conversion
- Signed-in users should be able to revisit paid projects and results later
- The workspace should keep source context visible so generations do not feel detached from the original room
- The route should work comfortably on mobile because many photos will be captured on phones

## Task breakdown

- Define the workspace payload shape and DTOs
- Build the guest-first single-project experience
- Add signed-in history, saved projects, and recent activity views
- Add conversion states for regenerate, save, and start-new-project actions
- Add responsive layout treatment for upload, brief review, and gallery browsing

## Acceptance criteria

- The main workspace can show a source photo, structured brief, job state, and generated outputs together
- Guests can complete the first flow without getting lost
- Signed-in users can return to prior projects without relying on brittle URL state

## Non-goals

- Team collaboration and comments
- Public share galleries in the MVP
