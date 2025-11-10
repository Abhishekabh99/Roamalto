# Roamalto

Founder-led Europe travel (Italy • Poland • Switzerland). WhatsApp-first inquiries.

## Local Demo

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
2. Start the local Postgres instance (Docker required):
   ```bash
   npm run dev:db
   ```
   The helper script reuses an existing `roamalto-postgres` container or provisions one with a `roamalto_pg` volume so data survives restarts.
3. Install dependencies:
   ```bash
   npm ci
   ```
4. Seed demo data (packages, admin user, and analytics fixtures):
   ```bash
   npm run seed
   ```
5. Run the development server (fonts disabled for restrictive networks):
   ```bash
   NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev
   ```
6. Visit `http://localhost:3000` for the marketing site, `http://localhost:3000/api/auth/signin` to trigger a magic link, and `/admin` after completing the sign-in flow.

> **Magic link login** – when SMTP credentials are not set the magic link is printed to the dev server logs. Share the link with `ADMIN_SEED_EMAIL` (defaults to `admin@roamalto.demo`) to enter the admin dashboard.

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
| `EMAIL_FROM` | From email for authentication | `travel@roamalto.com` |
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
