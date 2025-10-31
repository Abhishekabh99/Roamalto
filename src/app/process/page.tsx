import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CONTACT_PHONE } from "@/data/site";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

const processSteps = [
  {
    title: "Kick-off on WhatsApp",
    description:
      "Share travel dates, travellers’ details, celebration moments, dietary needs, and inspiration boards. We map budget bands and visa timelines up-front.",
    deliverables: [
      "Visa eligibility check and personalised checklist",
      "Suggested travel window and flight plan pointers",
      "Initial vibe-board of stays and experiences",
    ],
  },
  {
    title: "Co-create your itinerary",
    description:
      "Within 48 hours receive curated day-wise plans, stay mixes, transfers, and reserve-now vs pay-later breakdowns.",
    deliverables: [
      "Multiple itinerary versions with pilot pricing",
      "Dining and activity shortlists for every city",
      "Payment schedule and cancellation safeguards",
    ],
  },
  {
    title: "Book, prep, and travel stress-free",
    description:
      "We handle bookings, visa appointments, insurance, and on-trip concierge. All confirmations live inside your mobile itinerary.",
    deliverables: [
      "Visa document review + interview prep",
      "Confirmed stays, transfers, and experiences",
      "WhatsApp concierge during the trip",
    ],
  },
];

const faqs = [
  {
    question: "How early should I start planning?",
    answer:
      "For smooth visa processing we recommend 90-120 days before departure. Last-minute? Ping us — we prioritise urgent requests when possible.",
  },
  {
    question: "Do you charge a planning fee?",
    answer:
      "Yes, a transparent planning retainer is collected before detailed itineraries are shared. It is adjusted against final bookings.",
  },
  {
    question: "Can Roamalto handle Schengen visas?",
    answer:
      "Absolutely. We prepare document bundles, schedule biometrics, and brief you for interviews across Italy, Poland, and Switzerland embassies.",
  },
];

const pageUrl = `${SITE_URL}/process`;

export const metadata: Metadata = {
  title: "Process",
  description:
    "Understand the Roamalto travel planning process — from the first WhatsApp chat to on-trip concierge support.",
  alternates: {
    canonical: "/process",
  },
  openGraph: {
    title: "How Roamalto Plans Your Europe Trip",
    description:
      "See the three-phase Roamalto methodology covering discovery, itinerary co-creation, and on-trip concierge support.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto trip planning process overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamalto Planning Process",
    description:
      "Learn how Roamalto collaborates with you from WhatsApp brief to on-ground concierge.",
    images: [OG_IMAGE_URL],
  },
};

export default function ProcessPage() {
  return (
    <main
      id="main-content"
      className="container mx-auto max-w-screen-xl flex-1 px-4"
    >
      <section className="py-10 md:py-14 lg:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <SectionHeading
            eyebrow="Process"
            title="From WhatsApp brief to wheels-up support"
            description="Three collaborative phases that keep planning easy, transparent, and personalised."
            align="center"
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                aria-label={`Phase ${index + 1}: ${step.title}`}
                className="flex h-full flex-col items-center gap-4 rounded-3xl bg-brand-sand/60 p-5 text-center shadow-[var(--shadow-card)] ring-1 ring-border transition-shadow hover:shadow-md md:items-start md:p-6 md:text-left"
              >
                <header className="flex w-full flex-col items-center gap-3 md:flex-row md:items-start md:gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-semibold text-brand-sand md:h-7 md:w-7"
                  >
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-green">
                      Phase {index + 1}
                    </p>
                    <h2 className="mt-2 heading-3 md:mt-3">{step.title}</h2>
                  </div>
                </header>
                <p className="text-sm leading-relaxed text-foreground-muted md:text-base">
                  {step.description}
                </p>
                <ul className="mt-6 grid w-full gap-2 text-center text-sm text-foreground-muted md:text-left md:text-base">
                  {step.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex items-start justify-center gap-3 md:justify-start"
                    >
                      <span className="mt-[0.45em] inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="rounded-3xl bg-brand-green px-6 py-10 text-brand-sand shadow-[var(--shadow-card)] md:px-12">
            <h2 className="heading-2 text-brand-sand">
              Ready to get your customised plan?
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-brand-sand/90 md:text-base">
              Share your trip basics on WhatsApp. We revert with timelines, visa insights,
              and a curated first draft within two days.
            </p>
            <div className="mt-6">
              <WhatsAppCTA
                phone={CONTACT_PHONE}
                text="Hi Roamalto, walk me through your planning process."
                utm={{ utm_content: "process-page" }}
                label="Start the chat"
                size="lg"
                variant="light"
              />
            </div>
          </div>

          <div className="space-y-6 rounded-3xl bg-white px-6 py-10 shadow-[var(--shadow-card)] ring-1 ring-border md:px-12">
            <h2 className="heading-2 text-brand-slate">
              FAQs
            </h2>
            <div className="space-y-6 text-sm text-foreground-muted md:text-base">
              {faqs.map((faq) => (
                <div key={faq.question} className="space-y-2">
                  <h3 className="heading-3">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
