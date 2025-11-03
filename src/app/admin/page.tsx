import { db } from "@/db/kysely";
import { currentUser } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const serializeDate = (value: Date) => value.toISOString();

export default async function AdminPage() {
  const user = await currentUser();

  const [packages, leads, bookings, events] = await Promise.all([
    db
      .selectFrom("packages")
      .select(["id", "slug", "title", "days", "highlights", "price_from", "active", "created_at"])
      .orderBy("created_at", "desc")
      .execute(),
    db
      .selectFrom("leads")
      .select(["id", "name", "email", "phone", "country", "travel_window", "source", "utm", "created_at"])
      .orderBy("created_at", "desc")
      .limit(200)
      .execute(),
    db
      .selectFrom("bookings")
      .leftJoin("leads", "leads.id", "bookings.lead_id")
      .leftJoin("packages", "packages.id", "bookings.package_id")
      .select([
        "bookings.id as id",
        "bookings.lead_id as lead_id",
        "bookings.package_id as package_id",
        "bookings.status as status",
        "bookings.amount_estimate as amount_estimate",
        "bookings.meta as meta",
        "bookings.created_at as created_at",
        "leads.name as lead_name",
        "leads.email as lead_email",
        "leads.country as lead_country",
        "packages.title as package_title",
      ])
      .orderBy("bookings.created_at", "desc")
      .limit(200)
      .execute(),
    db
      .selectFrom("events")
      .select(["id", "type", "path", "session_id", "meta", "created_at"])
      .orderBy("created_at", "desc")
      .limit(200)
      .execute(),
  ]);

  const dashboardProps = {
    viewerRole: user?.role ?? "viewer",
    packages: packages.map((pkg) => ({
      id: pkg.id,
      slug: pkg.slug,
      title: pkg.title,
      days: pkg.days,
      highlights: pkg.highlights ?? [],
      priceFrom: pkg.price_from ?? null,
      active: pkg.active,
      createdAt: serializeDate(pkg.created_at),
    })),
    leads: leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      travelWindow: lead.travel_window,
      source: lead.source ?? "",
      utm: lead.utm ?? null,
      createdAt: serializeDate(lead.created_at),
    })),
    bookings: bookings.map((booking) => ({
      id: booking.id,
      leadId: booking.lead_id,
      packageId: booking.package_id,
      status: booking.status,
      amountEstimate: booking.amount_estimate ?? null,
      meta: booking.meta ?? null,
      createdAt: serializeDate(booking.created_at),
      leadName: booking.lead_name ?? "",
      leadEmail: booking.lead_email ?? "",
      leadCountry: booking.lead_country ?? "",
      packageTitle: booking.package_title ?? "",
    })),
    events: events.map((event) => ({
      id: event.id,
      type: event.type,
      path: event.path,
      sessionId: event.session_id ?? "",
      meta: event.meta ?? null,
      createdAt: serializeDate(event.created_at),
    })),
  };

  return <AdminDashboard {...dashboardProps} />;
}
