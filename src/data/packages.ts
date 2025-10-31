export type DayPlan = {
  label: string;
  detail: string;
};

export type TravelPackage = {
  id: string;
  location: string;
  title: string;
  duration: number;
  tagline: string;
  highlights: string[];
  itinerary: DayPlan[];
};

export const featuredPackages: TravelPackage[] = [
  {
    id: "italy-7d",
    location: "Italy",
    title: "Italy Signature 7 Days",
    duration: 7,
    tagline: "Rome’s history, Florence’s art, Amalfi’s sunsets — stitched end to end.",
    highlights: [
      "Priority Vatican & Colosseum entries with licensed experts",
      "Day trip to Tuscan vineyards with pasta-making lunch",
      "Private driver along the Amalfi Coast with sunset cruise add-on",
    ],
    itinerary: [
      {
        label: "Day 1",
        detail: "Arrive in Rome, twilight Trastevere food crawl, and gelato tasting.",
      },
      {
        label: "Day 3",
        detail: "Florence renaissance walk, Uffizi express entry, artisan leather workshop.",
      },
      {
        label: "Day 6",
        detail: "Amalfi drive with Positano photo stops, limoncello farm visit, sunset cruise.",
      },
    ],
  },
  {
    id: "poland-6d",
    location: "Poland",
    title: "Poland Heritage 6 Days",
    duration: 6,
    tagline: "Warsaw resilience, Kraków charm, and Tatras panoramas in one loop.",
    highlights: [
      "Curated WWII and Solidarity history immersion with local storytellers",
      "Day trip to Zakopane with thermal spa passes",
      "Pierogi masterclass and vodka tasting night",
    ],
    itinerary: [
      {
        label: "Day 1",
        detail: "Warsaw Old Town stroll, Chopin recital, and river dinner cruise.",
      },
      {
        label: "Day 3",
        detail: "Kraków royal route, Wawel Castle secrets tour, Kazimierz supper club.",
      },
      {
        label: "Day 5",
        detail: "Zakopane cable car ride, thermal spa soak, and Goral folk evening.",
      },
    ],
  },
  {
    id: "switzerland-7d",
    location: "Switzerland",
    title: "Switzerland Alpine 7 Days",
    duration: 7,
    tagline: "Iconic peaks, boutique lakeside stays, and chocolate ateliers.",
    highlights: [
      "Mount Titlis snow adventure with skip-the-line tickets",
      "Bernese Oberland scenic rail upgrades and reserved seats",
      "Interlaken helicopter optional add-on with photo pro",
    ],
    itinerary: [
      {
        label: "Day 1",
        detail: "Zurich arrival, lake promenade walk, and chocolate atelier workshop.",
      },
      {
        label: "Day 4",
        detail: "Lucerne old town, Mount Titlis glacier park, and fondue dinner cruise.",
      },
      {
        label: "Day 6",
        detail: "Jungfrau region golden pass rail, Grindelwald sunrise lookout breakfast.",
      },
    ],
  },
];
