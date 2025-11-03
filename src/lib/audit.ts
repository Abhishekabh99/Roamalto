import { db } from "@/db/kysely";
import type { JsonValue } from "@/db/types";

interface AuditLogInput {
  userId?: string | null;
  action: string;
  subject: string;
  details?: JsonValue | null;
}

export const logAudit = async ({ userId, action, subject, details }: AuditLogInput) => {
  try {
    await db
      .insertInto("audit_log")
      .values({
        user_id: userId ?? null,
        action,
        subject,
        details: details ?? null,
      })
      .execute();
  } catch (error) {
    console.error("Failed to log audit event", error);
  }
};
