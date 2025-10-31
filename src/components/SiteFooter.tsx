"use client";

import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/site";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

const normalizedPhone = CONTACT_PHONE.startsWith("+")
  ? CONTACT_PHONE
  : `+${CONTACT_PHONE}`;

export const SiteFooter = () => {
  return (
    <footer className="bg-deepgreen text-sand pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-sand/70">
              Roamalto
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Ready to design your Europe story?
            </h2>
            <p className="text-sm text-sand/85 md:text-base">
              Get your personalised itinerary, visa checklist, and budget plan
              over a quick WhatsApp chat.
            </p>
            <WhatsAppCTA
              phone={CONTACT_PHONE}
              text="Hey Roamalto, let's start planning!"
              utm={{ utm_content: "footer-cta" }}
              label="Start a WhatsApp chat"
              size="lg"
              className="bg-white text-deepgreen hover:bg-white/90"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-sand/80">
              Contact
            </h3>
            <div className="space-y-2 text-sm md:text-base">
              <a
                href={`tel:${normalizedPhone}`}
                className="flex flex-col text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-sand/60">
                  Phone
                </span>
                <span className="font-medium">{normalizedPhone}</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex flex-col text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                <span className="text-xs uppercase tracking-[0.25em] text-sand/60">
                  Email
                </span>
                <span className="font-medium">{CONTACT_EMAIL}</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-sand/80">
              Explore
            </h3>
            <nav className="flex flex-col gap-2 text-sm md:text-base">
              <Link
                href="/packages"
                className="text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                Travel packages
              </Link>
              <Link
                href="/process"
                className="text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                Planning process
              </Link>
              <Link
                href="/privacy"
                className="text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                Privacy policy
              </Link>
              <Link
                href="/contact"
                className="text-sand/90 transition hover:text-white focus-visible:text-white"
              >
                Contact form
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-6 text-xs uppercase tracking-[0.3em] text-sand/60 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Roamalto</span>
          <span className="text-sand/50">
            Italy · Poland · Switzerland · WhatsApp-first concierge
          </span>
        </div>
      </div>
    </footer>
  );
};
