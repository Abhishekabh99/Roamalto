import { CONTACT_PHONE } from "@/data/site";

const WA_BASE_URL = "https://wa.me/";

const FALLBACK_WA_TEXT = "Hi Abhishek, I want a Europe package!";

const envText = process.env.NEXT_PUBLIC_WHATSAPP_TEXT?.trim();
export const DEFAULT_WA_TEXT = envText && envText.length > 0 ? envText : FALLBACK_WA_TEXT;

const envPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/[^\d]/g, "");
const fallbackPhone = CONTACT_PHONE.replace(/[^\d]/g, "");
export const DEFAULT_WA_PHONE = envPhone && envPhone.length > 5 ? envPhone : fallbackPhone;

export const DEFAULT_WA_UTM = {
  utm_source: "site",
  utm_medium: "cta",
  utm_campaign: "whatsapp",
} as const satisfies Record<string, string>;

export type WhatsAppLinkOptions = {
  phone?: string;
  text?: string;
  utm?: Record<string, string | number | undefined>;
};

const normalizeUtm = (
  utm?: Record<string, string | number | undefined>,
) => {
  if (!utm) return {};

  return Object.entries(utm).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        return acc;
      }

      acc[key] = String(value);
      return acc;
    },
    {},
  );
};

export const mergeWaUtm = (
  utm?: Record<string, string | number | undefined>,
): Record<string, string> => ({
  ...DEFAULT_WA_UTM,
  ...normalizeUtm(utm),
});

export const buildWaLink = (
  phone: string | undefined,
  text: string = DEFAULT_WA_TEXT,
  utm?: Record<string, string | number | undefined>,
) => {
  const normalizedPhone = phone && phone.trim().length > 0 ? phone : DEFAULT_WA_PHONE;
  const sanitizedPhone = normalizedPhone.replace(/[^\d]/g, "");
  const phoneParam = sanitizedPhone.length > 0 ? sanitizedPhone : DEFAULT_WA_PHONE;
  const params = new URLSearchParams();
  const normalizedText = text.trim() || DEFAULT_WA_TEXT;
  params.set("text", normalizedText);

  const mergedUtm = mergeWaUtm(utm);

  Object.entries(mergedUtm).forEach(([key, value]) => {
    params.set(key, value);
  });

  return `${WA_BASE_URL}${phoneParam}?${params.toString()}`;
};

export const buildWhatsAppLink = ({
  phone,
  text = DEFAULT_WA_TEXT,
  utm,
}: WhatsAppLinkOptions) => buildWaLink(phone, text, utm);
