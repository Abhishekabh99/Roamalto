"use client";

import { useMemo } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  DEFAULT_WA_TEXT,
  buildWaLink,
  mergeWaUtm,
  type WhatsAppLinkOptions,
} from "@/lib/whatsapp";

type WhatsAppCTAProps = WhatsAppLinkOptions & {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "light";
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold shadow-lg transition-all duration-150 hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const sizeStyles: Record<NonNullable<WhatsAppCTAProps["size"]>, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base md:text-lg",
};

const variantStyles: Record<NonNullable<WhatsAppCTAProps["variant"]>, string> =
  {
    primary:
      "bg-deepgreen text-sand shadow-deepgreen/20 hover:bg-deepgreen/90 focus-visible:ring-deepgreen/70 focus-visible:ring-offset-sand",
    light:
      "bg-white text-deepgreen shadow-deepgreen/10 hover:bg-white/90 focus-visible:ring-deepgreen/50 focus-visible:ring-offset-white",
  };

export const WhatsAppCTA = ({
  phone,
  text,
  utm,
  label = "Chat on WhatsApp",
  className = "",
  size = "md",
  variant = "primary",
}: WhatsAppCTAProps) => {
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
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={() =>
        track({
          event: "whatsapp_cta_click",
          phone,
          utm: mergedUtm,
          label,
          text: message,
        })
      }
    >
      {label}
    </a>
  );
};
