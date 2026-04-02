# AGENTS.md

## Overview
Upmodel is an AI remodeling preview app for homeowners and renovators.
Prioritize polished customer-facing experiences and keep model/provider internals out of the UI.
Use `docs/prds` for product requirements and `.agents/` for repo workflow notes and sibling references.

## Stack
- Bun workspaces
- SvelteKit 2 + Svelte 5
- Tailwind CSS v4 + shadcn-svelte for UI
- Better Auth for authentication
- Drizzle ORM + PostgreSQL
- AI SDK + Vercel AI Gateway
- Docker Compose for local infrastructure
- mise for developer tasks
- Biome for formatting and linting

## Product defaults
- Guests get one complimentary remodel generation before conversion
- Paid usage happens through a combined sign-up and credit-pack purchase flow
- The long-term product center of gravity is the `/model` workspace
