"use client";

import { useCallback } from "react";
import { trackEvent } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/useAnalytics";

interface WhatsAppClickOptions {
  href: string;
  phone: string;
  label: string;
  message: string;
  utm?: Record<string, unknown> | null;
  surface?: string;
}

const sanitizeUtm = (utm?: Record<string, unknown> | null) => {
  if (!utm) {
    return undefined;
  }

  const entries = Object.entries(utm)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => [key, String(value)] as const);

  return entries.length ? Object.fromEntries(entries) : undefined;
};

export const useWhatsAppClick = ({ href, phone, label, message, utm, surface }: WhatsAppClickOptions) => {
  const { track } = useAnalytics();

  return useCallback(
    async (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (typeof window === "undefined") {
        return;
      }

      const sanitizedUtm = sanitizeUtm(utm);
      const baseMeta = {
        phone,
        label,
        text: message,
        from: window.location.pathname + window.location.search,
      };

      const detailedMeta = {
        ...baseMeta,
        ...(surface ? { surface } : {}),
        ...(sanitizedUtm ? { utm: sanitizedUtm } : {}),
      };

      track({
        event: "whatsapp_cta_click",
        ...detailedMeta,
      });

      const analyticsPromise = trackEvent("cta_click", detailedMeta);

      const shouldBypass =
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;

      if (shouldBypass) {
        return;
      }

      event.preventDefault();

      let navigated = false;
      const openWindow = () => {
        if (!navigated) {
          window.open(href, "_blank", "noopener");
          navigated = true;
        }
      };

      const fallback = window.setTimeout(openWindow, 120);

      try {
        await analyticsPromise;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("WhatsApp tracking failed", error);
        }
      } finally {
        window.clearTimeout(fallback);
        openWindow();
      }
    },
    [href, label, message, phone, surface, track, utm],
  );
};
