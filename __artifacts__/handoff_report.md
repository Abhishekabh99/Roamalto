# Roamalto Codex Cloud Handoff

## Open the site from VS Code
1. Ensure `.env.local` matches the local overrides in the README (127.0.0.1 Postgres, blank email SMTP, `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1`).
2. Start Postgres via Docker: `docker start roamalto-postgres || docker run -d --name roamalto-postgres ...` (see README for full command).
3. Install dependencies with `npm ci` (or `npm install` if the lock file drifts).
4. Run the dev server from VS Code: `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev`.
5. Open the marketing site, auth screen, and admin dashboard:
   ```bash
   xdg-open http://localhost:3000
   xdg-open http://localhost:3000/api/auth/signin
   xdg-open http://localhost:3000/admin
   ```
6. Sign in as `admin@roamalto.demo`. Copy the magic link from the terminal when SMTP is not configured.

## Demo checklist
- `POST /api/event` – **blocked** (server never started because npm registry returned HTTP 403; see `__artifacts__/probe_event.http`).
- `POST /api/lead` – **blocked** for the same reason (`__artifacts__/probe_lead.http`).
- `/admin` dashboard – **not verified** (Next.js failed to install, so no dev server).
- CSV exports – curl attempts recorded in `__artifacts__/exports/*.log`; all failed to connect because the web app was unavailable.

## Analysis summary
- ESLint (`npm run lint`) failed: missing `eslint` package due to npm registry HTTP 403. Logs in `__artifacts__/lint.txt` and `__artifacts__/eslint-fix.txt`.
- TypeScript check (`npx tsc --noEmit`) failed: multiple `Cannot find module` errors caused by missing node modules (`__artifacts__/typecheck.txt`).
- Tests (`npm run test`) failed: Node test runner could not resolve `typescript` (`__artifacts__/tests.txt`).
- Build (`npm run build`) failed: `next` binary absent (`__artifacts__/build.txt`).
- Lighthouse probes could not run because the CLI download returned HTTP 403 (`__artifacts__/lighthouse-home.log`).

All failures stem from the sandbox’s inability to download packages from the npm registry (recorded in `__artifacts__/errors.log`).

## UI / responsive adjustments
- Updated `MobileMenu` to use a fixed, padded, scrollable container so the mobile navigation no longer clips on small screens (`src/components/MobileMenu.tsx`).

## Exports
- Generated placeholder export files under `__artifacts__/exports/` (leads, events, bookings) – each currently contains the curl connection error output because the API was unreachable.

## Next steps for production
1. Re-run `npm ci` or `npm install` in an environment with npm registry access so dependencies install correctly.
2. Start Docker Desktop (or provision remote Postgres) and run the seed script (`npm run seed`).
3. Re-run lint, type-check, tests, build, and Lighthouse after dependencies install.
4. Push the branch to GitHub and trigger the Vercel build once local verification passes.
5. Map the production domain in Vercel and update `SITEMAP_BASE_URL` to the live origin.
