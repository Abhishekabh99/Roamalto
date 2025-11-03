import { db } from "@/db/kysely";
import { currentSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { leadSchema } from "@/lib/validators/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = leadSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid lead payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const payload = validation.data;
  const session = await currentSession();

  const [lead] = await db
    .insertInto("leads")
    .values({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      country: payload.country,
      travel_window: payload.travel_window,
      notes: payload.notes ?? null,
      source: payload.source ?? null,
      utm: payload.utm ?? null,
    })
    .returning(["id", "created_at"])
    .execute();

  await logAudit({
    userId: session?.user.id,
    action: "lead_create",
    subject: `lead:${lead.id}`,
    details: {
      source: payload.source ?? null,
      email: payload.email,
      country: payload.country,
    },
  });

  return NextResponse.json({ ok: true, id: lead.id, createdAt: lead.created_at }, { status: 201 });
}
