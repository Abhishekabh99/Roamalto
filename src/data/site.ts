export const CONTACT_PHONE = "91XXXXXXXXXX";
export const CONTACT_EMAIL = "hello@roamalto.example";

export const DEFAULT_UTM = {
  utm_source: "website",
  utm_medium: "cta",
  utm_campaign: "roamalto_launch",
} satisfies Record<string, string>;

export const WHY_US_POINTS = [
  {
    title: "Time saved, memories maximised",
    description:
      "Lean on done-for-you planning, visa checklists, and on-trip concierge so you just show up.",
  },
  {
    title: "Visa handholding",
    description:
      "We guide you through documents, appointments, and interview prep tailored for Indian travellers.",
  },
  {
    title: "Founder-travelled spots",
    description:
      "Roamalto itineraries are crafted from personal trips across Italy, Poland, and Switzerland.",
  },
  {
    title: "Totally custom itineraries",
    description:
      "Every plan is tailored to your travel pace, family make-up, and must-see wish-list.",
  },
] as const;

export const FOUNDER_SPOTS = [
  {
    title: "Golden hour at Rome’s Aventine Hill",
    description:
      "Skip the crowds at keyhole views and enjoy a private picnic setup overlooking St. Peter’s.",
    image: "/images/rome-spot.svg",
    imageAlt:
      "Sunset picnic looking out to St. Peter’s Basilica from Aventine Hill in Rome.",
  },
  {
    title: "Hidden jazz cellars in Kraków",
    description:
      "Wind down with live Polish jazz after your walking tour — we book the tables ahead.",
    image: "/images/krakow-spot.svg",
    imageAlt:
      "Arched underground jazz club entrance glowing with warm light in Kraków.",
  },
  {
    title: "Sunrise fondue in Grindelwald",
    description:
      "Beat the day-trippers with first gondola access and a slope-side breakfast spread.",
    image: "/images/grindelwald-spot.svg",
    imageAlt:
      "Alpine sunrise over Grindelwald with cable cars and breakfast table in the foreground.",
  },
] as const;
