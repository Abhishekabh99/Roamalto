import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import { AuthorizationError, requireRole } from "@/lib/auth";
import { exportQuerySchema, jsonSchema } from "@/lib/validators/api";
import { format } from "@fast-csv/format";
import { NextRequest, NextResponse } from "next/server";

const EXPORTABLE_TABLES = new Set(["leads", "events", "bookings"]);
const EDIT_ROLES: UserRole[] = ["admin", "agent"];

const endOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

const toIso = (value: Date | null | undefined) => (value ? new Date(value).toISOString() : "");

const encodeMeta = (value: unknown) => {
  if (value === null || value === undefined) return "";
  try {
    jsonSchema.parse(value);
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ table: string }> },
) {
  const params = await context.params;
  try {
    await requireRole(EDIT_ROLES);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  const table = params.table;

  if (!EXPORTABLE_TABLES.has(table)) {
    return NextResponse.json({ error: "Unsupported export" }, { status: 400 });
  }

  const queryValidation = exportQuerySchema.safeParse({
    from: request.nextUrl.searchParams.get("from") ?? undefined,
    to: request.nextUrl.searchParams.get("to") ?? undefined,
  });

  if (!queryValidation.success) {
    return NextResponse.json({ error: "Invalid date filters" }, { status: 422 });
  }

  const { from, to } = queryValidation.data;

  let rows: Record<string, unknown>[] = [];

  if (table === "leads") {
    let leadsQuery = db
      .selectFrom("leads")
      .select(["id", "name", "email", "phone", "country", "travel_window", "source", "utm", "created_at"])
      .orderBy("created_at", "desc");

    if (from) {
      leadsQuery = leadsQuery.where("created_at", ">=", from);
    }

    if (to) {
      leadsQuery = leadsQuery.where("created_at", "<=", endOfDay(to));
    }

    const leads = await leadsQuery.execute();

    rows = leads.map((lead): Record<string, unknown> => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      travel_window: lead.travel_window,
      source: lead.source ?? "",
      utm: encodeMeta(lead.utm),
      created_at: toIso(lead.created_at),
    }));
  } else if (table === "events") {
    let eventsQuery = db
      .selectFrom("events")
      .select(["id", "type", "path", "session_id", "meta", "created_at"])
      .orderBy("created_at", "desc");

    if (from) {
      eventsQuery = eventsQuery.where("created_at", ">=", from);
    }

    if (to) {
      eventsQuery = eventsQuery.where("created_at", "<=", endOfDay(to));
    }

    const events = await eventsQuery.execute();

    rows = events.map((event): Record<string, unknown> => ({
      id: event.id,
      type: event.type,
      path: event.path,
      session_id: event.session_id ?? "",
      meta: encodeMeta(event.meta),
      created_at: toIso(event.created_at),
    }));
  } else if (table === "bookings") {
    let bookingsQuery = db
      .selectFrom("bookings")
      .leftJoin("leads", "leads.id", "bookings.lead_id")
      .leftJoin("packages", "packages.id", "bookings.package_id")
      .select([
        "bookings.id as id",
        "bookings.status as status",
        "bookings.amount_estimate as amount_estimate",
        "bookings.meta as meta",
        "bookings.created_at as created_at",
        "leads.name as lead_name",
        "leads.email as lead_email",
        "packages.title as package_title",
      ])
      .orderBy("bookings.created_at", "desc");

    if (from) {
      bookingsQuery = bookingsQuery.where("bookings.created_at", ">=", from);
    }

    if (to) {
      bookingsQuery = bookingsQuery.where("bookings.created_at", "<=", endOfDay(to));
    }

    const bookings = await bookingsQuery.execute();

    rows = bookings.map((booking): Record<string, unknown> => ({
      id: booking.id,
      status: booking.status,
      amount_estimate: booking.amount_estimate ?? "",
      meta: encodeMeta(booking.meta),
      lead_name: booking.lead_name ?? "",
      lead_email: booking.lead_email ?? "",
      package_title: booking.package_title ?? "",
      created_at: toIso(booking.created_at),
    }));
  }

  const csvStream = format({ headers: true });
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      csvStream.on("error", (error) => controller.error(error));
      csvStream.on("data", (chunk) => {
        if (chunk instanceof Buffer) {
          controller.enqueue(new Uint8Array(chunk));
        } else {
          controller.enqueue(encoder.encode(String(chunk)));
        }
      });
      csvStream.on("end", () => controller.close());
    },
    cancel() {
      csvStream.destroy();
    },
  });

  rows.forEach((row) => {
    csvStream.write(row);
  });
  csvStream.end();

  const timestamp = new Date().toISOString().replace(/[:]/g, "-");
  const filename = `${table}-${timestamp}.csv`;

  return new NextResponse(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
