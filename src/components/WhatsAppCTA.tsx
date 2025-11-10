"use client";

import { useMemo } from "react";
import { useWhatsAppClick } from "@/hooks/useWhatsAppClick";
import {
  DEFAULT_WA_PHONE,
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
  surface?: string;
};

const baseStyles =
  "inline-flex w-full items-center justify-center rounded-xl font-semibold leading-snug shadow-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:w-auto";

const sizeStyles: Record<NonNullable<WhatsAppCTAProps["size"]>, string> = {
  sm: "px-4 py-2.5 text-[clamp(0.875rem,1.8vw,1rem)]",
  md: "px-5 py-3 text-[clamp(0.9375rem,1.9vw,1.0625rem)]",
  lg: "px-6 py-3.5 text-[clamp(1rem,2vw,1.1875rem)]",
};

const variantStyles: Record<NonNullable<WhatsAppCTAProps["variant"]>, string> =
  {
    primary:
      "bg-brand-green text-brand-sand shadow-brand-green/20 hover:bg-brand-green/90 focus-visible:ring-brand-green/70 focus-visible:ring-offset-brand-sand",
    light:
      "bg-white text-brand-green shadow-brand-green/10 hover:bg-white/90 focus-visible:ring-brand-green/50 focus-visible:ring-offset-white",
  };

export const WhatsAppCTA = ({
  phone = DEFAULT_WA_PHONE,
  text,
  utm,
  label = "Chat on WhatsApp",
  className = "",
  size = "md",
  variant = "primary",
  surface = "primary-cta",
}: WhatsAppCTAProps) => {
  const message = text?.trim() ? text.trim() : DEFAULT_WA_TEXT;
  const mergedUtm = useMemo(() => mergeWaUtm(utm), [utm]);

  const href = useMemo(
    () => buildWaLink(phone, message, mergedUtm),
    [phone, message, mergedUtm],
  );

  const handleClick = useWhatsAppClick({
    href,
    phone,
    label,
    message,
    utm: mergedUtm,
    surface,
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className={`${baseStyles} min-h-[44px] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={handleClick}
    >
      {label}
    </a>
  );
};
