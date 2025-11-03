import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import { AuthorizationError, requireRole } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { bookingSchema } from "@/lib/validators/api";
import { NextRequest, NextResponse } from "next/server";

const EDIT_ROLES: UserRole[] = ["admin", "agent"];

export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireRole(EDIT_ROLES);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = bookingSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid booking payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const payload = validation.data;

  const [booking] = await db
    .insertInto("bookings")
    .values({
      lead_id: payload.lead_id,
      package_id: payload.package_id,
      status: "new",
      amount_estimate: payload.amount_estimate ?? null,
      meta: payload.meta ?? null,
    })
    .returning(["id", "status", "created_at"])
    .execute();

  await logAudit({
    userId: session.user.id,
    action: "booking_create",
    subject: `booking:${booking.id}`,
    details: {
      leadId: payload.lead_id,
      packageId: payload.package_id,
      amountEstimate: payload.amount_estimate ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: booking.id, status: booking.status }, { status: 201 });
}
