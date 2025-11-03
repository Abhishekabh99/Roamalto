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
