"use client";

import { useMemo } from "react";
import { CONTACT_PHONE } from "@/data/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  DEFAULT_WA_TEXT,
  buildWaLink,
  mergeWaUtm,
} from "@/lib/whatsapp";

type FloatingWhatsAppButtonProps = {
  label?: string;
  phone?: string;
  text?: string;
  utm?: Record<string, string | number | undefined>;
};

export const FloatingWhatsAppButton = ({
  label = "Chat with Roamalto on WhatsApp",
  phone = CONTACT_PHONE,
  text,
  utm,
}: FloatingWhatsAppButtonProps) => {
  const { track } = useAnalytics();

  const message = text?.trim() ? text : DEFAULT_WA_TEXT;
  const mergedUtm = useMemo(() => mergeWaUtm(utm), [utm]);
  const href = useMemo(
    () => buildWaLink(phone, message, utm),
    [phone, message, utm],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-deepgreen text-white shadow-lg transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-deepgreen md:hidden"
      onClick={() =>
        track({
          event: "whatsapp_cta_click",
          phone,
          utm: mergedUtm,
          label,
          text: message,
          surface: "floating-button",
        })
      }
    >
      <span className="sr-only">{label}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="currentColor"
        focusable="false"
      >
        <path d="M12.04 2.01c-5.52 0-10 4.48-10 10 0 1.76.46 3.45 1.33 4.96L2 22l5.19-1.35c1.45.79 3.09 1.21 4.85 1.21h.01c5.52 0 10-4.48 10-10s-4.48-9.85-10.01-9.85zm5.82 14.24c-.24.68-1.39 1.31-1.93 1.38-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.7-4.15-4.84-4.34-.14-.19-1.16-1.54-1.16-2.94 0-1.4.74-2.09 1-2.37.26-.28.58-.35.77-.35.19 0 .39 0 .56.01.18.01.43-.07.67.51.24.58.81 2.01.88 2.16.07.15.12.33.02.52-.1.19-.16.32-.32.49-.16.17-.34.38-.49.51-.16.12-.32.26-.14.51.19.26.83 1.37 1.78 2.22 1.22 1.1 2.24 1.44 2.55 1.6.31.17.49.14.67-.08.18-.21.77-.9.97-1.21.2-.31.41-.26.68-.16.28.1 1.79.84 2.09.99.3.15.49.23.56.37.07.13.07.75-.17 1.43z" />
      </svg>
    </a>
  );
};
