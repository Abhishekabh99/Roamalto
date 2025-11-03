import type { ReactNode } from "react";
import type { UserRole } from "@/db/types";
import { requireRole } from "@/lib/auth";

const ALLOWED_ROLES: UserRole[] = ["admin", "agent"];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole(ALLOWED_ROLES);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      {children}
    </div>
  );
}
