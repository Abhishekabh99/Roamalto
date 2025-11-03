"use client";

import { useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

type ConsentState = "accepted" | "rejected" | "unknown";

const EU_LANGUAGE_PREFIXES = [
  "de",
  "fr",
  "it",
  "es",
  "pt",
  "pl",
  "nl",
  "sv",
  "da",
  "fi",
  "no",
  "cs",
  "sk",
  "sl",
  "hu",
  "ro",
  "bg",
  "hr",
  "et",
  "lv",
  "lt",
  "el",
  "ga",
  "mt",
];

const isEuLocale = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const languages = Array.from(new Set([navigator.language, ...(navigator.languages ?? [])])).filter(Boolean);
  return languages.some((lang) => {
    const normalised = lang?.toLowerCase() ?? "";
    return EU_LANGUAGE_PREFIXES.some((prefix) => normalised.startsWith(prefix));
  });
};

export const ConsentBanner = () => {
  const initialConsent: ConsentState =
    typeof window === "undefined" ? "unknown" : getAnalyticsConsent();
  const [visible, setVisible] = useState(
    () => initialConsent === "unknown" && isEuLocale(),
  );

  const handleChoice = (choice: "accepted" | "rejected") => {
    setAnalyticsConsent(choice);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6">
      <div className="w-full max-w-4xl rounded-2xl border border-sand-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
        <p className="text-sm text-slate/80">
          Roamalto uses minimal, cookie-free analytics to understand page views and CTA performance. Accepting
          helps us track CTA clicks and itinerary interactions; declining keeps analytics to anonymous page
          loads only.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="inline-flex items-center justify-center rounded-lg bg-deepgreen px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="inline-flex items-center justify-center rounded-lg border border-sand-300 px-4 py-2 text-sm font-semibold text-deepgreen transition hover:bg-sand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
