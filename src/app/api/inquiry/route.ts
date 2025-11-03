import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import { AuthorizationError, requireRole } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { inquirySchema } from "@/lib/validators/api";
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

  const validation = inquirySchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid inquiry payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const payload = validation.data;

  const [inquiry] = await db
    .insertInto("inquiries")
    .values({
      lead_id: payload.lead_id,
      channel: payload.channel,
      message: payload.message,
    })
    .returning(["id", "created_at"])
    .execute();

  await logAudit({
    userId: session.user.id,
    action: "inquiry_create",
    subject: `lead:${payload.lead_id}`,
    details: {
      inquiryId: inquiry.id,
      channel: payload.channel,
    },
  });

  return NextResponse.json({ ok: true, id: inquiry.id, createdAt: inquiry.created_at }, { status: 201 });
}
