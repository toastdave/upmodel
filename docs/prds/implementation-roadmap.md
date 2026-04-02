# Implementation Roadmap

## Near-term sequence

1. Platform scaffold and repo setup
2. Guest session plumbing and starter `/model` flow
3. Project creation, uploads, and room-brief persistence
4. Generation orchestration with local and hosted provider paths
5. One complimentary guest generation with enforced usage wall
6. Combined sign-up and purchase conversion flow
7. Billing fulfillment, credit ledger, and account/history views
8. Trust, privacy, and operational hardening

## Recommended milestones

### Milestone 1

- Finalize platform scaffold
- Land the initial schema and seed data
- Keep the landing page and `/model` route visually aligned with the product thesis

Status: complete

### Milestone 2

- Build guest projects and source photo upload
- Add remodel brief analysis and review surfaces
- Persist project summaries for later history views

Status: in progress

- Guest projects, source photo upload, object storage, and draft room briefs are now working end to end
- Brief review and richer analysis remain next

### Milestone 3

- Execute the first complimentary generation
- Show job status and output variants in the workspace
- Route the second action into conversion

Status: partially complete

- The complimentary generation path, persisted result variant, and second-action conversion redirect are now working
- Provider-backed generation and richer job-state UX remain next

### Milestone 4

- Complete auth, checkout, webhook handling, and guest migration
- Add billing balance, purchase history, and saved project history
- Harden storage, moderation, and observability
