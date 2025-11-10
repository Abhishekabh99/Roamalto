const defaultSiteUrl =
  process.env.NODE_ENV === "production" ? "https://roamalto.com" : "http://localhost:3000";

const configuredBaseUrl = process.env.SITEMAP_BASE_URL?.trim();

export const SITE_URL = (configuredBaseUrl && configuredBaseUrl.length > 0
  ? configuredBaseUrl
  : defaultSiteUrl
).replace(/\/$/, "");

export const OG_IMAGE_URL = `${SITE_URL}/og.jpg`;
