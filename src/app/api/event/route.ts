import { db } from "@/db/kysely";
import type { JsonValue } from "@/db/types";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { eventSchema } from "@/lib/validators/api";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 10;
const WINDOW_SECONDS = 60;

const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
};

const getSessionKey = (sessionId?: string) => sessionId ?? "anonymous";

export async function POST(request: NextRequest) {
  let parsedBody: unknown;

  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = eventSchema.safeParse(parsedBody);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid event payload", details: validation.error.flatten() },
      { status: 422 },
    );
  }

  const ip = getClientIp(request);
  const { type, path, sessionId, meta } = validation.data;

  const rateKey = `event:${ip}:${getSessionKey(sessionId)}`;
  const rateCheck = await checkRateLimit(rateKey, RATE_LIMIT, WINDOW_SECONDS);

  if (!rateCheck.success) {
    return new NextResponse(JSON.stringify({ error: "Too many events" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...rateLimitHeaders(rateCheck),
      },
    });
  }

  await db
    .insertInto("events")
    .values({
      type,
      path,
      session_id: sessionId ?? null,
      meta: meta ?? null,
    })
    .execute();

  if (type === "page_view") {
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const dateKey = new Date().toISOString().slice(0, 10);
    const hashSource = `${userAgent}:${ip}:${dateKey}:${getSessionKey(sessionId)}`;
    const uaHash = createHash("sha256").update(hashSource).digest("hex");

    let utm: JsonValue | null = null;
    if (meta && typeof meta === "object" && !Array.isArray(meta) && "utm" in meta) {
      const candidate = (meta as Record<string, unknown>).utm;
      if (candidate && typeof candidate === "object") {
        utm = candidate as JsonValue;
      }
    }

    await db
      .insertInto("visits")
      .values({
        path,
        ua_hash: uaHash,
        utm,
      })
      .execute();
  }

  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...rateLimitHeaders(rateCheck),
    },
  });
}
