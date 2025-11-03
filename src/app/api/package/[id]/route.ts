import { db } from "@/db/kysely";
import type { UserRole } from "@/db/types";
import { AuthorizationError, requireRole } from "@/lib/auth";
import { packageUpdateSchema } from "@/lib/validators/api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ADMIN_ONLY: UserRole[] = ["admin"];
const packageIdSchema = z.string().uuid();

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;

  let session;
  try {
    session = await requireRole(ADMIN_ONLY);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }

  const idCheck = packageIdSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
  }

  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = packageUpdateSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid package payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const payload = validation.data;

  const updates: Partial<{
    title: string;
    days: number;
    highlights: string[];
    price_from: number | null;
    active: boolean;
  }> = {
    title: payload.title,
    days: payload.days,
    highlights: payload.highlights,
    price_from: payload.price_from ?? null,
  };

  if (payload.active !== undefined) {
    updates.active = payload.active;
  }

  const updated = await db
    .updateTable("packages")
    .set(updates)
    .where("id", "=", idCheck.data)
    .returning(["id", "slug", "title", "days", "highlights", "price_from", "active", "created_at"])
    .executeTakeFirst();

  if (!updated) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, package: updated, updatedBy: session.user.id });
}
