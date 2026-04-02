# Upmodel

Upmodel is an AI remodeling preview app for homeowners and renovators. Users upload a room photo, describe the direction they want, try one complimentary guest generation, and then convert through a combined sign-up and credit-pack purchase flow.

## Requirements

- `mise`
- `Docker` with `docker compose`
- `Tailscale` for tailnet access

## Locked stack

- `SvelteKit` + `Svelte 5`
- `Tailwind CSS v4`
- `shadcn-svelte`
- `Drizzle ORM`
- `Postgres`
- `Better Auth`
- `Polar`
- `AI SDK` + `Vercel AI Gateway`
- `Ollama` for local AI routing
- `Bun workspaces`
- `Biome`
- `Docker Compose`
- `mise`

## Workspace layout

- `apps/web` - landing page, guest trial funnel, future auth, billing, and model workspace
- `packages/db` - Drizzle schema, migrations, pricing helpers, and seed data
- `docs/prds` - product vision, platform plan, and future implementation phases
- `AGENTS.md` and `.agents/` - agent-facing repo guidance and sibling references

## Port block

Upmodel uses the `2101` project block so it does not collide with sibling apps already using `1201` through `2001` ranges.

- Web app: `2101`
- Postgres: `2102`
- Mailpit SMTP/UI: `2103` / `2104`
- MinIO API/console: `2105` / `2106`
- Ollama API: `2107`

## Getting started

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` for your machine:

```dotenv
BETTER_AUTH_URL=https://<device>.<tailnet>.ts.net:2101
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:2101,https://<device>.<tailnet>.ts.net:2101
```

3. Install the toolchain and dependencies:

```bash
mise install
mise run install
```

4. Choose a development workflow:

- `mise run dev` for the web app on your host machine with Docker-managed support services
- `mise run dev:docker` for the entire stack in Docker with hot reload

Optional local AI model setup:

```bash
mise run ai:pull:analysis
mise run ai:pull:image
```

## Local development

Start:

```bash
mise run docker:up
mise run db:push
mise run seed
mise run dev
```

Open:

- Web app: `http://localhost:2101`
- Mailpit: `http://localhost:2104`
- MinIO console: `http://localhost:2106`
- Ollama API: `http://localhost:2107`

Stop:

```bash
mise run docker:down
```

Reset local infrastructure data:

```bash
docker compose down -v
```

## Full Docker development

Start:

```bash
mise run dev:docker
```

Then initialize the database if needed:

```bash
mise run db:push
mise run seed
```

## Tailscale access

Start Tailscale Serve:

```bash
mise run tailscale:up
```

Check status:

```bash
mise run tailscale:status
```

Stop:

```bash
mise run tailscale:down
```

Open the app from another device on your tailnet:

```text
https://<device>.<tailnet>.ts.net:2101
```

Use the full `https://` URL. This setup serves HTTPS on port `2101`; `http://` requests to the tailnet hostname will fail.

## Product direction

- Guests can create one trial remodel before they must convert
- Paid usage flows through a combined sign-up and credit-pack purchase handoff
- Core domain is `project -> source photo -> room brief -> generation job -> generated variants`
- PRDs in `docs/prds` define the next implementation phases

## Core commands

- `mise run dev` - run the SvelteKit app locally with Bun
- `mise run dev:docker` - run the full stack in Docker with hot reloading
- `mise run ai:pull:analysis` - pull the local Ollama analysis model
- `mise run ai:pull:image` - pull the local Ollama image model
- `mise run ai:logs` - follow Ollama logs
- `mise run tailscale:up` - expose the app over Tailscale on port `2101`
- `mise run tailscale:status` - inspect Tailscale Serve status
- `mise run tailscale:down` - stop Tailscale Serve on port `2101`
- `mise run lint` - run Biome linting
- `mise run format` - format the repo with Biome
- `mise run check` - run Svelte and TypeScript checks
- `mise run test` - run Bun tests
- `mise run build` - produce the SSR build
- `mise run db:generate` - generate Drizzle migrations
- `mise run db:migrate` - apply migrations
- `mise run db:studio` - open Drizzle Studio

## Notes

- This repo intentionally follows the same Bun workspace shape as `upstage` and `tidy`.
- The initial scaffold focuses on platform setup, a guest-first landing experience, and future-ready docs rather than a finished AI workflow.
- Local development defaults to Ollama-friendly settings while leaving hosted Gemini and billing placeholders ready for follow-up work.
