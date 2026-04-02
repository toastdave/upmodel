# Platform Foundation

## Goal

Create the technical and design baseline for a fast-moving SvelteKit monolith that can support guest trials, AI image generation, storage, auth, and credit-based billing without forcing an early service split.

## MVP scope

- Bun workspace monorepo with `apps/web` and `packages/db`
- Bun-native SSR output, local Docker services, and mise task runners
- Environment handling, database ownership, local seeding, and unique port allocation
- Shared design tokens, public landing shell, starter `/model` route, and future-ready account/billing routes

## Requirements

- Local setup works from a fresh clone with documented commands
- Ports do not collide with sibling projects in the same parent workspace
- Database changes are versioned and repeatable
- The app shell feels opinionated enough to guide future product work
- Local AI defaults support Ollama while production-oriented envs support hosted Gemini routing

## Task breakdown

- Lock workspace conventions, package versions, and scripts
- Set up Biome, strict TypeScript, and baseline tests
- Containerize Postgres, MinIO, Mailpit, Ollama, and Bun SSR development
- Add environment variables for auth, billing, storage, AI routing, and public URLs
- Build the initial landing experience, `/model` route, and placeholder auth/account surfaces
- Seed baseline credit packs and remodel presets

## Acceptance criteria

- A new developer can start the app locally in under 15 minutes
- The app builds with Bun SSR output
- Schema, seeds, and local services run without manual patching
- The repo clearly mirrors sibling conventions while preserving a unique Upmodel product direction

## Initial implementation status

- Bun workspace, SvelteKit shell, Drizzle package, Docker Compose, and mise workflow are in place
- Upmodel now owns the collision-free `2101` through `2107` local port block
- The scaffold includes a working `/model` route, guest session plumbing, and media proxy support for guest-owned assets
- Local development has been verified against Postgres and MinIO with the current guest flow

## Remaining follow-up

- Wire Better Auth into the current guest-first shell
- Add deployment-ready environment validation and CI entrypoints
- Decide when to split any future worker logic into a separate package

## Non-goals

- Production infrastructure provisioning
- Worker autoscaling on day one
- A finished remodeling workflow in the scaffold phase
