"use client";

import type { Json } from "@/lib/validators/api";

const SESSION_STORAGE_KEY = "roamalto.analytics.session";
const CONSENT_STORAGE_KEY = "roamalto.analytics.consent";

type AnalyticsConsent = "unknown" | "accepted" | "rejected";

type AnalyticsEventType = "page_view" | "cta_click" | "book_click" | "itinerary_open";

type AnalyticsPayload = {
  type: AnalyticsEventType;
  path: string;
  sessionId?: string | null;
  meta?: Json;
};

let cachedSessionId: string | null = null;

const ensureSessionId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedSessionId) {
    return cachedSessionId;
  }

  const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (stored) {
    cachedSessionId = stored;
    return stored;
  }

  const generated = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, generated);
  cachedSessionId = generated;
  return generated;
};

const readConsent = (): AnalyticsConsent => {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === "accepted" || stored === "rejected") {
    return stored;
  }
  return "unknown";
};

export const getAnalyticsConsent = (): AnalyticsConsent => readConsent();

export const setAnalyticsConsent = (status: "accepted" | "rejected") => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
};

const postEvent = async (payload: AnalyticsPayload) => {
  try {
    const response = await fetch("/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: payload.type === "page_view",
    });

    if (!response.ok && process.env.NODE_ENV !== "production") {
      console.warn("Failed to send analytics event", payload, await response.text());
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Analytics network error", error);
    }
  }
};

export const trackEvent = async (
  type: AnalyticsEventType,
  meta?: Json,
  path?: string,
) => {
  if (typeof window === "undefined") {
    return;
  }

  if (type !== "page_view" && getAnalyticsConsent() !== "accepted") {
    if (process.env.NODE_ENV !== "production") {
      console.debug("Skipping analytics event until consent granted", type);
    }
    return;
  }

  const sessionId = ensureSessionId();
  const eventPath = path ?? window.location.pathname + window.location.search;

  await postEvent({
    type,
    path: eventPath,
    sessionId,
    meta,
  });
};

export const getAnalyticsSessionId = () => ensureSessionId();
