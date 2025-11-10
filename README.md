# Roamalto

Founder-led Europe travel (Italy • Poland • Switzerland). WhatsApp-first inquiries.

## Local Demo

1. Copy the sample environment file if `.env.local` is missing:
   ```bash
   cp .env.example .env.local
   ```
   Required overrides for local runs:
   - `DATABASE_URL=postgres://roamalto:pass@127.0.0.1:5432/roamalto`
   - `NEXTAUTH_URL=http://localhost:3000`
   - leave `EMAIL_SERVER_*` blank so magic links print to the terminal
   - `EMAIL_FROM="Roamalto <magic@roamalto.demo>"`
   - `ADMIN_SEED_EMAIL=admin@roamalto.demo`
   - `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1`
   - `NEXT_PUBLIC_WHATSAPP_PHONE` / `NEXT_PUBLIC_WHATSAPP_TEXT` populated with safe placeholders
2. Start the local Postgres instance (Docker required):
   ```bash
   docker start roamalto-postgres 2>/dev/null \
     || docker run -d --name roamalto-postgres \
        -e POSTGRES_USER=roamalto \
        -e POSTGRES_PASSWORD=pass \
        -e POSTGRES_DB=roamalto \
        -v roamalto_pg:/var/lib/postgresql/data \
        -p 5432:5432 postgres:15
   ```
   The helper container reuses the `roamalto_pg` volume so your data persists between sessions.
3. Install dependencies:
   ```bash
   npm ci
   ```
   If the lock file drifts (e.g. missing packages) fall back to `npm install` to regenerate `package-lock.json`.
4. Seed demo data (packages, admin user, and analytics fixtures):
   ```bash
   npx tsx -r dotenv/config db/seed.ts
   ```
   or use the convenience script `npm run seed`.
5. Run the development server (fonts disabled for restrictive networks):
   ```bash
   NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev
   ```
6. Visit `http://localhost:3000` for the marketing site, `http://localhost:3000/api/auth/signin` to trigger a magic link, and `/admin` after completing the sign-in flow.

> **Magic link login** – when SMTP credentials are not set the magic link is printed to the dev server logs. Share the link with `ADMIN_SEED_EMAIL` (defaults to `admin@roamalto.demo`) to enter the admin dashboard.

### Open website from VS Code

From the integrated terminal:

```bash
NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev
xdg-open http://localhost:3000 >/dev/null 2>&1 &
xdg-open http://localhost:3000/api/auth/signin >/dev/null 2>&1 &
```

After you paste the console magic link into the browser, open the admin area:

```bash
xdg-open http://localhost:3000/admin >/dev/null 2>&1 &
```

### Open frontend

- `/` – hero, itinerary highlights, testimonials, WhatsApp CTA
- `/packages` – curated multi-country packages with accordion FAQs
- `/process` – step-by-step travel planning explainer
- `/contact` – lead capture form (persists to the `lead` table)
- `/privacy` – policy and compliance details

### Open backend & admin tools

- `/api/health` – lightweight JSON health probe (status + timestamp)
- `/api/event` – POST analytics beacons (`type`, `path`, `sessionId`)
- `/api/lead` – POST lead submissions (mirrors the contact form schema)
- `/api/export/*` – authenticated CSV exports for `leads`, `events`, and `bookings`
- `/admin` – protected dashboard for leads, bookings, and analytics (requires role = `admin`)

### Full demo script

1. Launch the dev server and authenticate via the email magic link.
2. Record an event:
   ```bash
   curl -i -X POST http://localhost:3000/api/event \
     -H 'Content-Type: application/json' \
     -d '{"type":"cta_click","path":"/","sessionId":"demo"}'
   ```
3. Create a lead:
   ```bash
   curl -i -X POST http://localhost:3000/api/lead \
     -H 'Content-Type: application/json' \
     -d '{"name":"Demo User","email":"demo@example.com","phone":"+910000000000","country":"Italy","travel_window":"Mar 2026"}'
   ```
4. Review the `/admin` dashboard to confirm the new event + lead appear in the tables.
5. Export CSV snapshots (authenticated session required):
   ```bash
   curl -L http://localhost:3000/api/export/leads -o __artifacts__/exports/leads.csv
   curl -L http://localhost:3000/api/export/events -o __artifacts__/exports/events.csv
   curl -L http://localhost:3000/api/export/bookings -o __artifacts__/exports/bookings.csv
   ```

### Troubleshooting

- **Docker unavailable** – without Docker Desktop or Podman you can point `DATABASE_URL` at a remote Postgres instance instead of `127.0.0.1`.
- **`npm ci` lock mismatches** – regenerate the lock file via `npm install` and commit the updated `package-lock.json`.
- **Network-restricted npm registry (HTTP 403)** – configure `npm config set registry https://registry.npmjs.org/` or mirror packages via an internal proxy.
- **Magic link email** – leaving `EMAIL_SERVER_*` blank uses the console fallback; copy the link straight from the dev server output.
- **Admin access** – ensure `ADMIN_SEED_EMAIL` matches the email you sign in with, or run `update users set role='admin' where email='…';` inside Postgres.
- **Fonts blocked** – keep `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1` in local and CI builds to avoid fetching Google Fonts.

## Production Deploy (Vercel via GitHub)

### Environment variables

| Key | Purpose | Example |
| --- | --- | --- |
| `DATABASE_URL` | Vercel Postgres / external Postgres connection string | `postgres://...` |
| `PGPOOL_MAX` | Optional pool size override | `10` |
| `NEXTAUTH_SECRET` | Secret used by NextAuth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Public origin for callbacks | `https://roamalto.com` |
| `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD` | Set to `1` to avoid downloading Google Fonts during builds | `1` |
| `EMAIL_SERVER_HOST` / `EMAIL_SERVER_PORT` / `EMAIL_SERVER_USER` / `EMAIL_SERVER_PASSWORD` | SMTP provider for magic links | – |
| `EMAIL_FROM` | From email for authentication | `Roamalto <magic@roamalto.com>` |
| `ADMIN_SEED_EMAIL` | Comma-separated admin emails seeded into the DB | `admin@roamalto.com` |
| `OAUTH_GOOGLE_ID` / `OAUTH_GOOGLE_SECRET` | Optional Google OAuth support | – |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional production-grade rate limiting | – |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Public phone number for all WhatsApp CTAs | `919876543210` |
| `NEXT_PUBLIC_WHATSAPP_TEXT` | Default pre-filled WhatsApp message | `Hi Abhishek, I want a Europe package!` |
| `SITEMAP_BASE_URL` | Base URL for sitemap/robots + SEO metadata | `https://roamalto.com` |

Mirror the same variables in the Vercel dashboard for Preview, Development, and Production environments.

### Database & auth handoff

- Run `npm run seed` locally (or via CI) whenever you need to bootstrap a new database with featured packages and the initial admin account.
- Keep `ADMIN_SEED_EMAIL` aligned between `.env.local` and Vercel so the seeded admin receives the first magic link.
- The Kysely client reads `DATABASE_URL` and `PGPOOL_MAX`; Postgres pooling defaults to `10` connections when unset.
- Set `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1` in every Vercel environment to keep builds deterministic when Google Fonts are unreachable.

### GitHub → Vercel deployment flow

1. Push the repository to GitHub (private or public).
2. In Vercel, import the project from GitHub and select the `main` branch.
3. Add the environment variables above for Production, Preview, and Development.
4. Enable the Postgres add-on or supply your own `DATABASE_URL`.
5. Trigger a deployment; Vercel will run `npm install`, `npm run build`, and expose the site at the assigned preview URL.
6. Configure your custom domain and set `SITEMAP_BASE_URL` to the final origin before launching.

### WhatsApp configuration

- `NEXT_PUBLIC_WHATSAPP_PHONE` and `NEXT_PUBLIC_WHATSAPP_TEXT` drive every CTA (`WhatsAppCTA`, floating button, sticky footer). Missing values fall back to safe defaults so links never break.
- `CONTACT_PHONE` in `src/data/site.ts` derives from the public env, ensuring the displayed number always matches the actual CTA target.

### SEO & sitemap

- Metadata for `/`, `/packages`, `/contact`, and `/privacy` now includes enriched Open Graph and Twitter tags. Update descriptions or titles as needed.
- `SITEMAP_BASE_URL` feeds `metadataBase`, the App Router sitemap (`src/app/sitemap.ts`), and `next-sitemap` for static exports.
- After every production build, the `postbuild` script runs `next-sitemap` to output `public/sitemap.xml` and `public/robots.txt` based on `next-sitemap.config.js`.

## Quality checks & scripts

| Command | Description |
| --- | --- |
| `npm run lint` | ESLint + TypeScript rules |
| `npm run typecheck` | `tsc --noEmit` validation |
| `npm run test` | Node test runner for library suites |
| `npm run build` | Production build verification |
| `npm run dev:db` | Start or reuse the Dockerised Postgres instance |
| `npm run dev:db:stop` | Stop & remove the local Postgres container |
| `npm run seed` | Seed database using dotenv-aware runner |
| `npm run export:leads` / `export:events` / `export:bookings` | Download CSV exports into `__artifacts__/exports/` |
| `npm run lh` | Run Lighthouse (home + packages) and save JSON reports into `__artifacts__/` |

## Exports & artifacts

- CSV exports land in `__artifacts__/exports/` (`leads.csv`, `events.csv`, `bookings.csv`).
- Lighthouse runs create `__artifacts__/lighthouse-home.json`, `__artifacts__/lighthouse-packages.json`, and a companion `__artifacts__/lighthouse-notes.md` summary.
- Capture UI screenshots into `__artifacts__/screens/` and keep `__artifacts__/manifest.json` updated with timestamps + file references for handoff packages.

## Tech stack

- Next.js App Router (TypeScript, Tailwind CSS v4)
- Inter via `next/font`
- Kysely + Postgres
- NextAuth email magic links

## Content & customisation

- Brand copy, phone, email, and UTM defaults: `src/data/site.ts`
- Packages and itineraries: `src/data/packages.ts`
- Shared UI components (CTA, cards, modals): `src/components/`
- Admin dashboard tables/cards: `src/components/admin/AdminDashboard.tsx`

When updating metadata or domain, adjust `SITEMAP_BASE_URL` and redeploy so both runtime sitemap handlers and `next-sitemap` outputs align with the new origin.
