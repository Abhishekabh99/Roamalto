import { db, destroyDb } from "./kysely";
import type { UserRole } from "./types";

interface PackageSeed {
  slug: string;
  title: string;
  days: number;
  priceFrom?: number;
  highlights: string[];
  itineraries: Array<{
    day: number;
    title: string;
    bullets: string[];
  }>;
}

const packages: PackageSeed[] = [
  {
    slug: "italy-immersive-7d",
    title: "Italy Classics in 7 Days",
    days: 7,
    priceFrom: 189900,
    highlights: [
      "Skip-the-line Vatican Museums & Sistine Chapel",
      "Sunset gondola ride through Venice canals",
      "Tuscan farmhouse lunch with local wine tasting",
    ],
    itineraries: [
      {
        day: 1,
        title: "Arrive in Rome & Twilight City Walk",
        bullets: ["Private airport pickup", "Check-in near the Trevi Fountain", "Gelato crawl at sunset"],
      },
      {
        day: 3,
        title: "Train to Florence & Uffizi Evening Tour",
        bullets: ["First-class Frecciarossa seats", "Duomo cupola climb", "Renaissance art with a local guide"],
      },
      {
        day: 5,
        title: "Venice Lagoon & Hidden Bacari",
        bullets: ["Luxury water taxi transfer", "Murano glass workshop", "Cicchetti tasting with prosecco"],
      },
    ],
  },
  {
    slug: "poland-heritage-6d",
    title: "Poland Heritage Trail 6 Days",
    days: 6,
    priceFrom: 139500,
    highlights: [
      "Curated Kraków walking tour with a historian",
      "Overnight stay in a fairytale Zakopane chalet",
      "Pierogi making class with a Polish grandma",
    ],
    itineraries: [
      {
        day: 1,
        title: "Kraków Old Town & Wawel Castle",
        bullets: ["Horse carriage orientation tour", "Private Wawel Castle guide", "Evening jazz in Kazimierz"],
      },
      {
        day: 4,
        title: "Zakopane Highlands Escape",
        bullets: ["Scenic cable car to Kasprowy Wierch", "Thermal spa & sauna session", "Goral folk dinner"],
      },
      {
        day: 6,
        title: "Warsaw Modern Stories",
        bullets: ["High-speed Pendolino ride", "Warsaw Uprising Museum highlights", "Rooftop farewell dinner"],
      },
    ],
  },
  {
    slug: "switzerland-alpine-7d",
    title: "Switzerland Alpine Icons 7 Days",
    days: 7,
    priceFrom: 249900,
    highlights: [
      "Glacier Express panoramic journey",
      "Jungfraujoch Top of Europe experience",
      "Private chocolate atelier workshop in Zurich",
    ],
    itineraries: [
      {
        day: 2,
        title: "Lucerne & Mount Pilatus",
        bullets: ["Lake Lucerne steamer cruise", "World's steepest cogwheel train", "Skyline dinner overlooking the Alps"],
      },
      {
        day: 4,
        title: "Zermatt & Glacier Express",
        bullets: ["Matterhorn sunrise viewpoint", "Glacier Express Excellence Class", "Wine pairing in Brig"],
      },
      {
        day: 6,
        title: "Bernese Oberland Peaks",
        bullets: ["Jungfraujoch excursion", "Ice Palace walkthrough", "Sledding in Grindelwald"],
      },
    ],
  },
];

const ADMIN_SEED_ROLE: UserRole = "admin";

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@example.com";

  await db.transaction().execute(async (trx) => {
    await trx
      .insertInto("users")
      .values({
        email: adminEmail,
        name: "Roamalto Admin",
        role: ADMIN_SEED_ROLE,
      })
      .onConflict((oc) =>
        oc.column("email").doUpdateSet((eb) => ({
          role: eb.ref("excluded.role"),
          name: eb.ref("excluded.name"),
        })),
      )
      .execute();

    for (const pkg of packages) {
      const inserted = await trx
        .insertInto("packages")
        .values({
          slug: pkg.slug,
          title: pkg.title,
          days: pkg.days,
          price_from: pkg.priceFrom ?? null,
          highlights: pkg.highlights,
        })
        .onConflict((oc) =>
          oc.column("slug").doUpdateSet((eb) => ({
            title: eb.ref("excluded.title"),
            days: eb.ref("excluded.days"),
            price_from: eb.ref("excluded.price_from"),
            highlights: eb.ref("excluded.highlights"),
            active: eb.val(true),
          })),
        )
        .returning(["id"])
        .executeTakeFirst();

      const packageId =
        inserted?.id ??
        (
          await trx
            .selectFrom("packages")
            .select(["id"])
            .where("slug", "=", pkg.slug)
            .executeTakeFirstOrThrow()
        ).id;

      for (const stop of pkg.itineraries) {
        await trx
          .insertInto("itineraries")
          .values({
            package_id: packageId,
            day_no: stop.day,
            title: stop.title,
            bullets: stop.bullets,
          })
          .onConflict((oc) =>
            oc.columns(["package_id", "day_no"]).doUpdateSet((eb) => ({
              title: eb.ref("excluded.title"),
              bullets: eb.ref("excluded.bullets"),
            })),
          )
          .execute();
      }
    }
  });

  console.log("Seed complete. Admin user:", adminEmail);
}

main()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await destroyDb();
  });
