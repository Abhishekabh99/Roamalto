import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/site";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

const pageUrl = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Roamalto privacy commitments covering WhatsApp conversations, email submissions, analytics events, and itinerary data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Roamalto Privacy Policy",
    description:
      "Learn how Roamalto protects your personal information across WhatsApp, email, analytics events, and itinerary planning systems.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto privacy commitments summary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamalto Privacy Policy",
    description:
      "Understand how Roamalto handles your data during bespoke Europe travel planning, from analytics events to WhatsApp chats.",
    images: [OG_IMAGE_URL],
  },
};

const lastUpdated = "December 2024";

export default function PrivacyPage() {
  return (
    <main id="main-content" className="container mx-auto max-w-screen-xl flex-1 px-4">
      <section className="py-10 md:py-14 lg:py-20">
        <article className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground-muted md:text-base">
          <h1 className="heading-1 text-brand-slate">Privacy Policy</h1>
          <p className="text-slate/70">Last updated: {lastUpdated}</p>
          <p>
            Roamalto is a WhatsApp-first, founder-led travel planning studio. We only collect the data needed
            to design, confirm, and support premium Europe itineraries. This page explains what we store, how
            long we keep it, the analytics events we log on this website, and the choices available to you.
          </p>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Information we collect</h2>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                Traveller details shared through WhatsApp, email, and contact forms (names, phone numbers,
                trip preferences, and special requests).
              </li>
              <li className="list-disc">
                Lead and booking records raised by our team (country of travel, enquiry notes, UTM source data,
                estimated budget, and agent updates).
              </li>
              <li className="list-disc">
                Lightweight website analytics events such as page views, CTA clicks, itinerary toggles, and
                booking interest signals. These events never include cookies, advertising identifiers, or full
                IP addresses.
              </li>
              <li className="list-disc">
                Visa documentation supplied for application support, including passports, photos, and
                invitation letters where applicable.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Website analytics & events</h2>
            <p>
              We operate our own analytics pipeline on Vercel Postgres. Each event stores the page path, an
              anonymised session identifier, and optional metadata (for example, the package slug linked to a
              CTA). We use this information to troubleshoot funnels and prioritise content improvements.
            </p>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                Events are retained for 12 months and analysed in aggregated dashboards accessible only to
                authorised Roamalto staff.
              </li>
              <li className="list-disc">
                Visitors arriving from EU locales see a consent banner; until consent is granted we log page
                views only and suppress personalised CTA or booking events.
              </li>
              <li className="list-disc">
                Clicking a WhatsApp CTA is recorded (phone number, surface, path) just before the redirect to
                <code className="rounded bg-sand/60 px-1">wa.me</code>, helping us attribute enquiries without interfering with your messaging
                app.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Leads, bookings, and documentation</h2>
            <p>
              Lead submissions and booking progress updates feed into our secure admin dashboard with
              role-based access (admin or agent). We use the data to craft itineraries, coordinate with hotels
              and guides, and maintain an audit log of service actions for accountability.
            </p>
            <p>
              Planning data is kept for up to 18 months after your trip to support rebookings and regulatory
              queries. Visa documents are deleted within 45 days of your return unless you ask us to retain
              them for future applications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Data retention</h2>
            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                Website analytics events: 12 months, then aggregated or discarded.
              </li>
              <li className="list-disc">
                Lead and booking records: up to 18 months after your travel end date.
              </li>
              <li className="list-disc">
                Visa documents: removed within 45 days of trip completion unless extended by written request.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Third-party access</h2>
            <p>
              Personal data is shared only with airlines, hotels, tour partners, visa facilitation centres, and
              insurance desks required to execute your itinerary. We do not sell, rent, or share data with
              advertisers or unrelated third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Consent & control</h2>
            <p>
              EU visitors can accept or decline analytics beyond essential page views using the on-site
              consent banner. You can revisit your choice by clearing the{" "}
              <code className="rounded bg-sand/60 px-1">roamalto.analytics.consent</code>{" "}
              preference from local storage or by emailing our team to reset it manually. Declining does not
              restrict access to content; it simply limits measurement to anonymous page loads.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Your rights</h2>
            <p>
              You may request access to the data we hold about you, ask for corrections, or instruct us to
              delete records (subject to legal retention requirements) by emailing{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full px-1 py-0.5 text-brand-green underline-offset-4 transition-colors hover:text-brand-green/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {CONTACT_EMAIL}
              </a>
              . We respond to all requests within seven working days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="heading-3 text-brand-slate">Contact</h2>
            <p>
              For privacy questions or to exercise your rights, message us on WhatsApp at +{CONTACT_PHONE} or
              email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full px-1 py-0.5 text-brand-green underline-offset-4 transition-colors hover:text-brand-green/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
