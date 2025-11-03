import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import { AuthorizationError, requireRole } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { bookingStatusSchema } from "@/lib/validators/api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EDIT_ROLES: UserRole[] = ["admin", "agent"];

const bookingIdSchema = z.string().uuid();

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  new: ["consulting"],
  consulting: ["docs"],
  docs: ["booked", "closed"],
  booked: [],
  closed: [],
};

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  let session;
  try {
    session = await requireRole(EDIT_ROLES);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  const idCheck = bookingIdSchema.safeParse(params.id);

  if (!idCheck.success) {
    return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
  }

  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = bookingStatusSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid status payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const booking = await db
    .selectFrom("bookings")
    .select(["id", "status", "lead_id", "package_id"])
    .where("id", "=", idCheck.data)
    .executeTakeFirst();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const currentStatus = booking.status;
  const nextStatus = validation.data.status;

  if (currentStatus === nextStatus) {
    return NextResponse.json({ ok: true, status: currentStatus });
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  if (!allowed.includes(nextStatus)) {
    return NextResponse.json(
      {
        error: `Cannot transition booking from ${currentStatus} to ${nextStatus}`,
      },
      { status: 400 },
    );
  }

  await db
    .updateTable("bookings")
    .set({ status: nextStatus })
    .where("id", "=", booking.id)
    .execute();

  await logAudit({
    userId: session.user.id,
    action: "booking_status_update",
    subject: `booking:${booking.id}`,
    details: {
      from: currentStatus,
      to: nextStatus,
    },
  });

  return NextResponse.json({ ok: true, status: nextStatus });
}
