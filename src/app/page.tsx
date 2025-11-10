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
    <main
      id="main-content"
      className="container mx-auto max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-8"
    >
      <section className="py-10 md:py-14 lg:py-20">
        <div className="relative isolate overflow-hidden rounded-3xl bg-white/85 p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8 md:p-12">
          <div className="flex min-h-[60vh] flex-col gap-8 md:min-h-[65vh] md:flex-row md:items-center md:justify-between md:gap-16">
            <div className="flex flex-1 flex-col gap-5 lg:gap-6">
              <p className="text-[clamp(0.75rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.3em] text-brand-green">
                Less planning, more roaming.
              </p>
              <h1 className="heading-1">
                I&apos;m the founder behind Roamalto — your personal Europe travel curator.
              </h1>
              <p className="body-text max-w-prose text-foreground-muted">
                I personally stitch Italy, Poland, and Switzerland journeys for Indian
                travellers — visas, bookings, and on-trip support handled. WhatsApp me
                and we start building your route right away.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <WhatsAppCTA
                  phone={CONTACT_PHONE}
                  text="Hi Roamalto, I'd like to plan a Europe trip."
                  utm={{ utm_content: "hero-primary" }}
                  label="Plan via WhatsApp"
                  size="lg"
                />
                <a
                  href="#why-us"
                  className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[clamp(0.95rem,1.1vw,1.05rem)] font-semibold text-brand-slate underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  See why travellers pick us
                </a>
              </div>
            </div>
            <div className="flex flex-1 justify-center md:justify-end">
              <Image
                src="/og.jpg"
                alt="Handcrafted Europe itineraries with Roamalto"
                width={1200}
                height={630}
                priority
                className="h-full w-full max-w-lg rounded-2xl object-cover shadow-[var(--shadow-card)] ring-1 ring-border"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-10 md:py-14 lg:py-20">
        <div className="rounded-3xl bg-white/90 p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8 md:p-10">
          <SectionHeading
            eyebrow="Why Roamalto"
            title="Trusted by families, honeymooners, and solo explorers"
            description="Founder-led planning with concierge-level support at every step."
          />
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
            {WHY_US_POINTS.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl bg-brand-sand/60 p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md sm:p-6"
              >
                <h3 className="heading-3">{point.title}</h3>
                <p className="mt-3 text-[clamp(0.95rem,1.05vw,1.05rem)] leading-relaxed text-foreground-muted md:text-[clamp(1.05rem,1vw+0.5rem,1.2rem)]">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="py-10 md:py-14 lg:py-20">
        <div className="space-y-8 md:space-y-10">
          <SectionHeading
            eyebrow="Featured Packages"
            title="Three curated routes to kickstart your planning"
            description="Ask for price ranges, personalise every detail, and get a transparent inclusions/exclusions sheet before you confirm."
          />
          <FeaturedPackagesSection packages={featuredPackages} />
          <p className="text-[clamp(0.95rem,1.05vw,1.05rem)] text-foreground-muted md:text-[clamp(1.05rem,1vw+0.5rem,1.2rem)]">
            You always know what&apos;s covered and what&apos;s optional add-on — I flag each
            inclusion and exclusion upfront so there are zero surprises later.
          </p>
        </div>
      </section>

      <section id="process" className="py-10 md:py-14 lg:py-20">
        <div className="rounded-3xl bg-white/90 p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8 md:p-10">
          <SectionHeading
            eyebrow="How We Work"
            title="Visas, bookings, and on-trip support handled"
            description="A four-step flow that keeps planning easy and transparent."
          />
          <ol className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {howWeWork.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl bg-brand-sand/60 p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md sm:p-6"
              >
                <p className="text-[clamp(0.75rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.2em] text-brand-green">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 heading-3">{step.title}</h3>
                <p className="mt-3 text-[clamp(0.95rem,1.05vw,1.05rem)] leading-relaxed text-foreground-muted md:text-[clamp(1.05rem,1vw+0.5rem,1.2rem)]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="founder" className="py-10 md:py-14 lg:py-20">
        <div className="rounded-3xl bg-white/90 p-6 shadow-[var(--shadow-card)] ring-1 ring-border sm:p-8 md:p-10">
          <SectionHeading
            eyebrow="Founder’s Photo-Spots"
            title="Personally scouted photo spots"
            description="Every stop here is a location I've walked, shot, and approved before it makes your itinerary."
          />
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {FOUNDER_SPOTS.map((spot, index) => (
              <article
                key={spot.title}
                className="flex flex-col justify-between rounded-2xl bg-white/95 p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md sm:p-6"
              >
                <div>
                  <Image
                    src={spot.image}
                    alt={spot.imageAlt}
                    width={640}
                    height={480}
                    className="h-auto w-full rounded-xl object-cover ring-1 ring-border"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 28vw, (min-width: 768px) 45vw, 92vw"
                  />
                  <h3 className="mt-4 heading-3">{spot.title}</h3>
                  <p className="mt-3 text-[clamp(0.95rem,1.05vw,1.05rem)] text-foreground-muted leading-relaxed overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] md:text-[clamp(1.05rem,1vw+0.5rem,1.2rem)] md:overflow-visible md:[display:block] md:[-webkit-line-clamp:unset]">
                    {spot.description}
                  </p>
                </div>
                <p className="mt-4 text-[clamp(0.75rem,0.9vw,0.85rem)] uppercase tracking-[0.2em] text-brand-green">
                  Photo recce ready
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
