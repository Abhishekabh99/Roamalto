# Roamalto

Founder-led Europe travel (Italy • Poland • Switzerland). WhatsApp-first inquiries.

## Quickstart

```bash
npm install
npm run dev
```

- Dev server: http://localhost:3000
- Type-check & lint: `npm run lint`
- Production build: `npm run build` then `npm run start`

## Backend Setup

1. Duplicate `.env.example` into `.env.local`.
2. Populate the following variables:
   - `DATABASE_URL`: Vercel Postgres connection string (Project Settings → Storage → Connect).
   - `NEXTAUTH_SECRET`: 32+ character random string (`openssl rand -base64 32`).
   - `NEXTAUTH_URL`: Application origin (e.g. `http://localhost:3000` for local development).
   - `EMAIL_*`: SMTP credentials for the NextAuth email provider (Resend, Mailtrap, Postmark, etc.).
   - `ADMIN_SEED_EMAIL`: The email that should receive the initial admin magic link.
   - Optional: `OAUTH_GOOGLE_*` for Google sign-in and `UPSTASH_REDIS_*` for production-grade rate limiting. Without Upstash the API falls back to an in-memory limiter suitable for development only.
3. Seed the database:

   ```bash
   npm run db:seed
   ```

   The script ensures the admin user (using `ADMIN_SEED_EMAIL`) and the demo travel packages exist.

4. Trigger the email sign-in flow by visiting `/api/auth/signin`, entering the seeded admin email, and clicking the magic link delivered by your SMTP provider. This grants access to `/admin`.
5. Mirror the same environment variables in the Vercel dashboard (Project Settings → Environment Variables) for each deployment environment.
6. Need a local Postgres quickly? Use Docker helpers:

   ```bash
   npm run dev:db       # start or reuse roamalto-postgres container
   npm run dev:db:stop  # stop & remove the container
   ```

   The scripts expose Postgres on `postgres://roamalto:pass@localhost:5432/roamalto`, which matches the default `DATABASE_URL` in `.env.local`.

## Tech Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- Inter via `next/font`
- Strict ESLint + Prettier defaults from Next.js

## Content & Customisation

- Brand copy, phone, email, and UTM defaults: `src/data/site.ts`
- Featured packages and sample itineraries: `src/data/packages.ts`
- Shared UI components (CTA, cards, modal, headings): `src/components/`
- Pages live under `src/app/`:
  - `/` home with JSON-LD, featured packages, founder picks
  - `/packages`, `/process`, `/contact`, `/privacy`
  - `/sitemap.xml`, `/robots.txt` generated from `sitemap.ts` and `robots.ts`

Update the `CONTACT_PHONE` placeholder before launch so WhatsApp CTAs resolve correctly.

## WhatsApp Analytics

Clicking any WhatsApp button pushes an event to `window.dataLayer`. If you connect Google Tag Manager, listen for `whatsapp_cta_click` events to trigger tags.

## Magic Link Sign-In Demo

With the default `.env.local` the email provider falls back to console logging whenever SMTP credentials are missing. To demo the admin login flow locally:

1. Start the dev server with font downloads disabled: `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1 npm run dev`.
2. Visit `http://localhost:3000/api/auth/signin` and enter `ADMIN_SEED_EMAIL` (defaults to `admin@roamalto.demo`).
3. The server prints a line similar to:

   ```
   [auth][magic-link] No SMTP configured. Share this link with admin@roamalto.demo: https://...
   ```

4. Open the printed magic link in a browser tab to complete sign-in, then load `/admin` to access the dashboard.

When SMTP credentials are provided, the same flow delivers magic links via the configured provider (e.g. Mailtrap, Postmark, Resend).

## Quality Checks

- `npm run lint` – ESLint + TypeScript rules
- `npm run typecheck` – tsc in no-emit mode
- `npm run test` – Node test runner for validation suites
- `npm run build` – production build verification

## Deployment

Deploy on Vercel or any Node.js host. Remember to set the production domain in `src/app/layout.tsx` (`metadataBase`) and `sitemap.ts` / `robots.ts` before going live.

### Vercel Deployment

1. Install dependencies with `npm ci`.
2. Build the project using `npm run build`.
3. Authenticate with `npx vercel login` if you have not linked your Vercel account in this environment.
4. Deploy to production via `npm run deploy:vercel`.

#### Vercel environment variables

Configure the following variables in Project Settings → Environment Variables before running the first deploy:

| Key | Suggested value (see `.env.local`) |
| --- | --- |
| `DATABASE_URL` | Connection string for your production Vercel Postgres (or Supabase / Neon) instance |
| `NEXTAUTH_URL` | `https://<your-production-domain>` |
| `NEXTAUTH_SECRET` | 32+ character random string (`openssl rand -base64 32`) |
| `EMAIL_SERVER_HOST` | SMTP host (Mailtrap, Postmark, Resend, etc.) |
| `EMAIL_SERVER_PORT` | SMTP port |
| `EMAIL_SERVER_USER` | SMTP username |
| `EMAIL_SERVER_PASSWORD` | SMTP password |
| `EMAIL_FROM` | Friendly from address (e.g. `travel@roamalto.com`) |
| `OAUTH_GOOGLE_ID` / `OAUTH_GOOGLE_SECRET` | (Optional) Google OAuth credentials when enabling Google sign-in |
| `ADMIN_SEED_EMAIL` | Comma-separated list of admin emails seeded into the database |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | (Optional) Upstash credentials for production rate limiting |
| `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD` | `1` to bypass Google Font download during Vercel builds in restricted networks |

After pushing to GitHub, Vercel will build preview deployments automatically. To deploy from the CLI, run:

```bash
npx vercel login
npx vercel --prod --yes
```

If your environment blocks Google Fonts during the build step, keep `NEXT_PRIVATE_SKIP_FONT_DOWNLOAD=1` (or supply a local font) in the Vercel build environment.
