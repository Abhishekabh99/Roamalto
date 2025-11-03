"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import type { Json } from "@/lib/validators/api";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export const AnalyticsProvider = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (previousPath.current === fullPath) {
      return;
    }

    previousPath.current = fullPath;

    const utm: Record<string, string> = {};
    if (searchParams) {
      UTM_KEYS.forEach((key) => {
        const value = searchParams.get(key);
        if (value) {
          utm[key] = value;
        }
      });
    }

    const analyticsMeta: Json = Object.keys(utm).length > 0 ? { fullPath, utm } : { fullPath };

    void trackEvent("page_view", analyticsMeta, fullPath);
  }, [pathname, searchParams]);

  return null;
};
