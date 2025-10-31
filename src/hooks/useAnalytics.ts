"use client";

import { useCallback } from "react";

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export const useAnalytics = () => {
  const track = useCallback((payload: DataLayerEvent) => {
    if (typeof window === "undefined") {
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push(payload);
  }, []);

  return { track };
};
