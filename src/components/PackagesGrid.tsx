"use client";

import { useState } from "react";
import { PackageCard } from "@/components/PackageCard";
import { Modal } from "@/components/Modal";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CONTACT_PHONE } from "@/data/site";
import type { TravelPackage } from "@/data/packages";

type PackagesGridProps = {
  packages: TravelPackage[];
};

export const PackagesGrid = ({ packages }: PackagesGridProps) => {
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const activePackage =
    activePackageId !== null
      ? packages.find((pkg) => pkg.id === activePackageId) ?? null
      : null;
  const modalId = "sample-itinerary-modal";

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            title={pkg.title}
            days={pkg.duration}
            locationTag={pkg.location}
            tagline={pkg.tagline}
            highlights={pkg.highlights.slice(0, 3)}
            cta={
              <>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-full border border-deepgreen px-5 py-3 text-sm font-semibold text-deepgreen transition-colors hover:bg-deepgreen/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white md:w-auto md:text-base"
                  aria-haspopup="dialog"
                  aria-expanded={activePackageId === pkg.id}
                  aria-controls={modalId}
                  onClick={() => setActivePackageId(pkg.id)}
                >
                  View sample itinerary
                </button>
                <WhatsAppCTA
                  phone={CONTACT_PHONE}
                  text={`I want to plan the ${pkg.location} trip with Roamalto.`}
                  utm={{
                    utm_content: pkg.id,
                  }}
                  label="Talk to a planner"
                  size="md"
                  className="w-full md:w-auto"
                />
              </>
            }
          />
        ))}
      </div>
      <Modal
        open={Boolean(activePackage)}
        onClose={() => setActivePackageId(null)}
        title={activePackage ? `${activePackage.title} — Sample Itinerary` : ""}
        id={modalId}
      >
        {activePackage?.itinerary.length ? (
          activePackage.itinerary.map((day) => (
            <div
              key={day.label}
              className="space-y-2 rounded-2xl bg-sand/60 p-4 md:p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-deepgreen">
                {day.label}
              </p>
              <p className="text-sm text-slate md:text-base">{day.detail}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate md:text-base">
            The full day-by-day plan unlocks after our discovery chat.
          </p>
        )}
        <p className="text-sm text-foreground-muted md:text-base">
          Full itineraries are personalised after our WhatsApp discovery chat.
        </p>
      </Modal>
    </>
  );
};
