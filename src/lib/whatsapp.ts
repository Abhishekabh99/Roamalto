const WA_BASE_URL = "https://wa.me/";

export const DEFAULT_WA_TEXT = "Hi Abhishek, I want a Europe package!";

export const DEFAULT_WA_UTM = {
  utm_source: "site",
  utm_medium: "cta",
  utm_campaign: "whatsapp",
} as const satisfies Record<string, string>;

export type WhatsAppLinkOptions = {
  phone: string;
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
  phone: string,
  text: string = DEFAULT_WA_TEXT,
  utm?: Record<string, string | number | undefined>,
) => {
  const sanitizedPhone = phone.replace(/[^\d]/g, "");
  const params = new URLSearchParams();
  const normalizedText = text.trim() || DEFAULT_WA_TEXT;
  params.set("text", normalizedText);

  const mergedUtm = mergeWaUtm(utm);

  Object.entries(mergedUtm).forEach(([key, value]) => {
    params.set(key, value);
  });

  return `${WA_BASE_URL}${sanitizedPhone}?${params.toString()}`;
};

export const buildWhatsAppLink = ({
  phone,
  text = DEFAULT_WA_TEXT,
  utm,
}: WhatsAppLinkOptions) => buildWaLink(phone, text, utm);
