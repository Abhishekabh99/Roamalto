# Roamalto Demo Status Report

- **Generated:** 2025-11-03T13:30:07+05:30
- **Environment:** Local CLI sandbox with `.env.local` (values redacted) pointing to the sample `postgres://roamalto:pass@localhost:5432/roamalto` connection string and console-based magic-link fallback.

## Database Migration & Seed
- Attempted `psql "$DATABASE_URL" -f db/schema.sql` and `npm run db:seed`.
- Result: ❌ Unable to connect to Postgres (`docker` daemon access is denied in this sandbox). Schema remained unapplied and seed did not run.
- Admin email configured for seeding: `admin@roamalto.demo` (not created because the database is offline).

## Demo API Flows
- Recorded responses: [`__artifacts__/demo_responses.json`](demo_responses.json).
- Outcome: all HTTP calls returned `ECONNREFUSED` with the dev server offline (blocked by the missing database).

## CSV Exports
- Placeholders located at [`__artifacts__/leads.csv`](leads.csv) and [`__artifacts__/events.csv`](events.csv); exports will populate after the API is reachable.

## Screens & Lighthouse
- Screenshots directory: `__artifacts__/screens/` (contains README explaining why captures are missing).
- Lighthouse summary: [`__artifacts__/lighthouse.json`](lighthouse.json) reports the run as skipped.

## Build & Tests
- `npm run lint` ✅
- `npm run test` ✅
- `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run build` ❌ — Google Font download blocked. Logs saved to [`__artifacts__/build_error.log`](build_error.log) and summarized in [`__artifacts__/build_summary.json`](build_summary.json).

## Remaining Actions for a Complete Demo
1. Provision Postgres (use `npm run dev:db` / `npm run dev:db:stop` locally) and rerun schema + seed to generate `db/seed-output.json`.
2. Start the dev server with `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev`, trigger a magic link, and replay the automated API flows.
3. With a live DB, call `/api/export/leads` and `/api/export/events` to capture real CSV artifacts.
4. Capture responsive screenshots (360 / 768 / 1024 / 1440 widths) and run Lighthouse (mobile + desktop).
5. For CI/Vercel builds behind restricted networks, keep `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1` (or switch to a locally hosted Inter font) to avoid font download failures.
