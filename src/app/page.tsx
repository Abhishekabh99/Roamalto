import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { FeaturedPackagesSection } from "@/components/home/FeaturedPackagesSection";
import { featuredPackages } from "@/data/packages";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FOUNDER_SPOTS,
  WHY_US_POINTS,
} from "@/data/site";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Custom Europe Itineraries for Indian Travellers",
  description:
    "Roamalto builds bespoke Italy, Poland, and Switzerland trips with visa handholding, founder-curated stays, and WhatsApp-first support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Roamalto — Your Personal Europe Travel Curator",
    description:
      "Plan Europe with visa guidance, curated stays, and concierge support. Start on WhatsApp.",
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto — Custom Europe Travel Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Your Europe Trip with Roamalto",
    description:
      "Founder-led itineraries for Italy, Poland, and Switzerland with visa prep and concierge.",
    images: [OG_IMAGE_URL],
  },
};

const howWeWork = [
  {
    title: "WhatsApp us",
    description: "Share travel dates, group type, and dream destinations in one chat.",
  },
  {
    title: "Plan together",
    description:
      "Receive curated itineraries, visa prep guidance, and budget options within 48 hours.",
  },
  {
    title: "Visa & bookings",
    description:
      "We manage appointments, documents, stays, experiences, and on-trip concierge.",
  },
  {
    title: "Fly and enjoy",
    description:
      "Touch down to a day-wise plan, local support, and handpicked photo spots.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Roamalto",
      "url": SITE_URL,
      "logo": `${SITE_URL}/favicon.ico`,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": CONTACT_EMAIL,
          "telephone": "+".concat(CONTACT_PHONE),
          "availableLanguage": ["en", "hi"],
        },
      ],
    },
    {
      "@type": "OfferCatalog",
      "name": "Roamalto Featured Trips",
      "itemListElement": featuredPackages.map((pkg, index) => ({
        "@type": "Offer",
        "name": pkg.title,
        "position": index + 1,
        "url": `${SITE_URL}/packages#${pkg.id}`,
        "itemOffered": {
          "@type": "Trip",
          "name": pkg.title,
          "description": pkg.tagline,
          "touristType": "FamilyTraveller",
          "itinerary": pkg.itinerary.map((day) => ({
            "@type": "ListItem",
            "name": day.label,
            "description": day.detail,
          })),
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main id="main-content" className="flex-1 bg-sand">
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-24 pt-20 md:pb-28 md:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-deepgreen">
            Less planning, more roaming.
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate md:text-5xl">
            I&apos;m the founder behind Roamalto — your personal Europe travel curator.
          </h1>
          <p className="max-w-2xl text-lg text-foreground-muted md:text-xl">
            I personally stitch Italy, Poland, and Switzerland journeys for Indian
            travellers — visas, bookings, and on-trip support handled. WhatsApp me
            and we start building your route right away.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <WhatsAppCTA
              phone={CONTACT_PHONE}
              text="Hi Roamalto, I'd like to plan a Europe trip."
              utm={{ utm_content: "hero-primary" }}
              label="Plan via WhatsApp"
              size="lg"
            />
            <a
              href="#why-us"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-slate underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
            >
              See why travellers pick us
            </a>
          </div>
        </div>
      </div>

      <section id="why-us" className="bg-white py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          <SectionHeading
            eyebrow="Why Roamalto"
            title="Trusted by families, honeymooners, and solo explorers"
            description="Founder-led planning with concierge-level support at every step."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {WHY_US_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-3xl bg-sand/60 p-6 shadow-[var(--shadow-card)] ring-1 ring-border"
              >
                <h3 className="text-lg font-semibold text-slate">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm text-foreground-muted">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="bg-sand py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          <SectionHeading
            eyebrow="Featured Packages"
            title="Three curated routes to kickstart your planning"
            description="Ask for price ranges, personalise every detail, and get a transparent inclusions/exclusions sheet before you confirm."
          />
          <FeaturedPackagesSection packages={featuredPackages} />
          <p className="text-sm text-foreground-muted">
            You always know what&apos;s covered and what&apos;s optional add-on — I flag each
            inclusion and exclusion upfront so there are zero surprises later.
          </p>
        </div>
      </section>

      <section id="process" className="bg-white py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          <SectionHeading
            eyebrow="How We Work"
            title="Visas, bookings, and on-trip support handled"
            description="A four-step flow that keeps planning easy and transparent."
          />
          <ol className="grid gap-6 md:grid-cols-2">
            {howWeWork.map((step, index) => (
              <li
                key={step.title}
                className="rounded-3xl bg-sand/60 p-6 shadow-[var(--shadow-card)] ring-1 ring-border"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deepgreen">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-foreground-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="founder" className="bg-sand py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
          <SectionHeading
            eyebrow="Founder’s Photo-Spots"
            title="Personally scouted photo spots"
            description="Every stop here is a location I've walked, shot, and approved before it makes your itinerary."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {FOUNDER_SPOTS.map((spot) => (
              <article
                key={spot.title}
                className="flex flex-col justify-between rounded-3xl bg-white/90 p-6 shadow-[var(--shadow-card)] ring-1 ring-border"
              >
                <div>
                  <Image
                    src={spot.image}
                    alt={spot.imageAlt}
                    width={640}
                    height={480}
                    className="h-auto w-full rounded-2xl object-cover ring-1 ring-border"
                    loading="lazy"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-slate">
                    {spot.title}
                  </h3>
                  <p className="mt-3 text-sm text-foreground-muted">
                    {spot.description}
                  </p>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-deepgreen">
                  Photo recce ready
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-deepgreen py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 text-center text-sand">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Ready to design your Europe story?
          </h2>
          <p className="text-base text-sand/90">
            Get your personalised itinerary, visa checklist, and budget plan over
            a quick WhatsApp chat.
          </p>
          <WhatsAppCTA
            phone={CONTACT_PHONE}
            text="Hey Roamalto, let's start planning!"
            utm={{ utm_content: "footer-cta" }}
            label="Start a WhatsApp chat"
            size="lg"
            className="bg-white text-deepgreen hover:bg-white/90"
          />
          <p className="text-xs uppercase tracking-[0.3em] text-sand/85">
            Italy · Poland · Switzerland
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
