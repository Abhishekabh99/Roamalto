import type { UserRole } from "@/db/types";
import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export class AuthorizationError extends Error {
  constructor(message = "Not authorised") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const currentSession = () => getServerSession(authOptions);

export const currentUser = async () => {
  const session = await currentSession();
  return session?.user ?? null;
};

export const requireRole = async (role: UserRole | UserRole[]) => {
  const session = await currentSession();
  if (!session?.user) {
    throw new AuthorizationError("Sign-in required");
  }

  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(session.user.role)) {
    throw new AuthorizationError("Insufficient permissions");
  }

  return session;
};

export const isRoleAllowed = (userRole: UserRole | undefined, role: UserRole | UserRole[]) => {
  const allowed = Array.isArray(role) ? role : [role];
  return !!userRole && allowed.includes(userRole);
};
