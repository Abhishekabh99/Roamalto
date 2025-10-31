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

## Deployment

Deploy on Vercel or any Node.js host. Remember to set the production domain in `src/app/layout.tsx` (`metadataBase`) and `sitemap.ts` / `robots.ts` before going live.

### Vercel Deployment

1. Install dependencies with `npm ci`.
2. Build the project using `npm run build`.
3. Authenticate with `npx vercel login` if you have not linked your Vercel account in this environment.
4. Deploy to production via `npm run deploy:vercel`.
