import type { ReactNode } from "react";

type PackageCardProps = {
  title: string;
  days: number;
  highlights: string[];
  cta: ReactNode;
  locationTag?: string;
  tagline?: string;
};

export const PackageCard = ({
  title,
  days,
  highlights,
  cta,
  locationTag,
  tagline,
}: PackageCardProps) => {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow sm:p-6 sm:transition">
      <div className="space-y-4 text-[clamp(0.95rem,1.05vw,1.05rem)]">
        <div className="space-y-2">
          {locationTag ? (
            <span className="inline-flex items-center rounded-full bg-sand px-3 py-1 text-[clamp(0.75rem,0.9vw,0.85rem)] font-semibold uppercase tracking-[0.32em] text-deepgreen">
              {locationTag}
            </span>
          ) : null}
          <h3 className="text-[clamp(1.4rem,1.2vw+1rem,2.1rem)] font-semibold text-slate">
            {title}
          </h3>
          <p className="font-medium text-foreground-muted">
            {days} day itinerary
          </p>
          {tagline ? (
            <p className="text-foreground-muted">{tagline}</p>
          ) : null}
        </div>
        <ul className="space-y-2 text-foreground-muted">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <span className="mt-[0.55em] h-1.5 w-1.5 rounded-full bg-deepgreen" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {cta}
      </div>
    </article>
  );
};
