"use client";

import { useEffect, useMemo, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { DEFAULT_WA_PHONE, DEFAULT_WA_TEXT, mergeWaUtm } from "@/lib/whatsapp";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

const STORAGE_KEY = "roamalto-mobile-cta-dismissed";

type MobileWhatsAppBarProps = {
  phone?: string;
  text?: string;
  label?: string;
  utm?: Record<string, string | number | undefined>;
  scrollTrigger?: number;
};

export const MobileWhatsAppBar = ({
  phone = DEFAULT_WA_PHONE,
  text,
  label = "Plan with Roamalto on WhatsApp",
  utm,
  scrollTrigger = 320,
}: MobileWhatsAppBarProps) => {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  });
  const [isVisible, setIsVisible] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (storedValue === "true") {
      const updateDismissed = () => setDismissed(true);
      if (typeof queueMicrotask === "function") {
        queueMicrotask(updateDismissed);
      } else {
        window.setTimeout(updateDismissed, 0);
      }
    }
  }, []);

  useEffect(() => {
    if (dismissed) {
      return;
    }

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setIsVisible(window.scrollY >= scrollTrigger);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, scrollTrigger]);

  const message = text?.trim() ? text.trim() : DEFAULT_WA_TEXT;
  const mergedUtm = useMemo(() => mergeWaUtm(utm), [utm]);
  const trackedUtm = useMemo(() => {
    return {
      ...mergedUtm,
      utm_content: "sticky-mobile-footer",
    };
  }, [mergedUtm]);

  if (dismissed) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 translate-y-full transition-transform duration-300 ease-out md:hidden ${
        isVisible ? "translate-y-0" : ""
      }`}
    >
      <div className="pointer-events-auto bg-deepgreen text-sand shadow-[0_-12px_32px_rgba(11,93,77,0.3)]">
        <div className="mx-auto flex w-full max-w-lg items-center gap-4 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand/70">
              WhatsApp concierge
            </p>
            <p className="text-sm font-medium text-white">{label}</p>
          </div>
          <WhatsAppCTA
            phone={phone}
            text={message}
            utm={trackedUtm}
            label="Open WhatsApp"
            size="sm"
            variant="light"
            className="whitespace-nowrap"
            surface="sticky-mobile-footer"
          />
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              track({
                event: "whatsapp_cta_dismiss",
                surface: "sticky-mobile-footer",
              });
              if (typeof window !== "undefined") {
                window.sessionStorage.setItem(STORAGE_KEY, "true");
              }
            }}
            aria-label="Dismiss WhatsApp planning bar"
            className="rounded-full p-2 text-sand/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-deepgreen"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
              focusable="false"
            >
              <path d="M13.41 12l4.3-4.29a1 1 0 0 0-1.42-1.42L12 10.59 7.71 6.29a1 1 0 0 0-1.42 1.42L10.59 12l-4.3 4.29a1 1 0 1 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
