"use client";

import { useMemo, useState } from "react";
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

  const activePackage = useMemo(
    () => packages.find((pkg) => pkg.id === activePackageId) ?? null,
    [activePackageId, packages],
  );

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            title={pkg.title}
            days={pkg.duration}
            locationTag={pkg.location}
            tagline={pkg.tagline}
            highlights={pkg.highlights.slice(0, 3)}
            cta={
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-deepgreen px-5 py-3 text-sm font-semibold text-deepgreen transition-colors hover:bg-deepgreen/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                />
              </div>
            }
          />
        ))}
      </div>
      <Modal
        open={Boolean(activePackage)}
        onClose={() => setActivePackageId(null)}
        title={activePackage ? `${activePackage.title} — Sample Itinerary` : ""}
      >
        {activePackage?.itinerary.length ? (
          activePackage.itinerary.map((day) => (
            <div key={day.label} className="rounded-2xl bg-sand/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-deepgreen">
                {day.label}
              </p>
              <p className="mt-2 text-sm text-slate">{day.detail}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate">
            The full day-by-day plan unlocks after our discovery chat.
          </p>
        )}
        <p className="text-sm text-foreground-muted">
          Full itineraries are personalised after our WhatsApp discovery chat.
        </p>
      </Modal>
    </>
  );
};
