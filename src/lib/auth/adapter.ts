import { db } from "@/db/kysely";
import type { Database, UserRole } from "@/db/types";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import type { Insertable, Kysely, Selectable, Updateable } from "kysely";

type Db = Kysely<Database>;
type UserRow = Selectable<Database["users"]>;
type AccountRow = Selectable<Database["accounts"]>;
type SessionRow = Selectable<Database["sessions"]>;
type VerificationTokenRow = Selectable<Database["verification_tokens"]>;
type AccountInsert = Insertable<Database["accounts"]>;
type SessionInsert = Insertable<Database["sessions"]>;
type VerificationTokenInsert = Insertable<Database["verification_tokens"]>;
type AdapterUserUpdate = Partial<AdapterUser> & Pick<AdapterUser, "id">;
type AdapterSessionUpdate = Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">;

const mapUser = (user: UserRow): AdapterUser & { role: UserRole } => {
  const adapterUser: AdapterUser = {
    id: user.id,
    email: user.email,
    emailVerified: null,
    name: user.name ?? undefined,
  };

  return { ...adapterUser, role: user.role as UserRole };
};

const mapSession = (session: SessionRow): AdapterSession => ({
  sessionToken: session.token,
  userId: session.user_id,
  expires: session.expires,
});

const mapAccount = (account: AccountRow): AdapterAccount => ({
  id: account.id,
  userId: account.user_id,
  type: account.type as AdapterAccount["type"],
  provider: account.provider,
  providerAccountId: account.provider_account_id,
  refresh_token: account.refresh_token ?? undefined,
  access_token: account.access_token ?? undefined,
  expires_at: account.expires_at ?? undefined,
  token_type: account.token_type ?? undefined,
  scope: account.scope ?? undefined,
  id_token: account.id_token ?? undefined,
  session_state: account.session_state ?? undefined,
  oauth_token_secret: account.oauth_token_secret ?? undefined,
  oauth_token: account.oauth_token ?? undefined,
});

const mapVerificationToken = (token: VerificationTokenRow): VerificationToken => ({
  identifier: token.identifier,
  token: token.token,
  expires: token.expires,
});

export const kyselyAdapter = (connection: Db = db): Adapter => ({
  createUser: async (user: AdapterUser) => {
    const inserted = await connection
      .insertInto("users")
      .values({
        email: user.email,
        name: user.name ?? null,
        role: (user as AdapterUser & { role?: UserRole }).role ?? "viewer",
      })
      .returningAll()
      .executeTakeFirst();

    if (!inserted) {
      throw new Error("Failed to create user");
    }

    return mapUser(inserted);
  },

  getUser: async (id) => {
    const userRow = await connection
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return userRow ? mapUser(userRow) : null;
  },

  getUserByEmail: async (email) => {
    const userRow = await connection
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    return userRow ? mapUser(userRow) : null;
  },

  getUserByAccount: async ({ provider, providerAccountId }: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
    const result = await connection
      .selectFrom("accounts")
      .innerJoin("users", "users.id", "accounts.user_id")
      .select([
        "users.id as user_id",
        "users.email as user_email",
        "users.name as user_name",
        "users.role as user_role",
        "users.created_at as user_created_at",
      ])
      .where("accounts.provider", "=", provider)
      .where("accounts.provider_account_id", "=", providerAccountId)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return mapUser({
      id: result.user_id,
      email: result.user_email,
      name: result.user_name,
      role: result.user_role,
      created_at: result.user_created_at,
    } as UserRow);
  },

  updateUser: async (user: AdapterUserUpdate) => {
    const updates: Partial<Updateable<Database["users"]>> = {};

    if (typeof user.email === "string") {
      updates.email = user.email;
    }

    if ("name" in user) {
      updates.name = user.name ?? null;
    }

    const maybeRole = (user as AdapterUser & { role?: UserRole }).role;
    if (maybeRole) {
      updates.role = maybeRole;
    }

    if (Object.keys(updates).length === 0) {
      const existing = await connection
        .selectFrom("users")
        .selectAll()
        .where("id", "=", user.id)
        .executeTakeFirst();

      if (!existing) {
        throw new Error("User not found");
      }

      return mapUser(existing);
    }

    const updated = await connection
      .updateTable("users")
      .set(updates)
      .where("id", "=", user.id)
      .returningAll()
      .executeTakeFirst();

    if (!updated) {
      throw new Error("User not found");
    }

    return mapUser(updated);
  },

  deleteUser: async (id) => {
    const deleted = await connection
      .deleteFrom("users")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return deleted ? mapUser(deleted) : null;
  },

  linkAccount: async (account: AdapterAccount) => {
    const accountValues: AccountInsert = {
      user_id: account.userId,
      type: account.type,
      provider: account.provider,
      provider_account_id: account.providerAccountId,
      refresh_token: account.refresh_token ?? null,
      access_token: account.access_token ?? null,
      expires_at: account.expires_at ?? null,
      token_type: account.token_type ?? null,
      scope: account.scope ?? null,
      id_token: account.id_token ?? null,
      session_state: account.session_state ?? null,
      oauth_token_secret: (account.oauth_token_secret ?? null) as string | null,
      oauth_token: (account.oauth_token ?? null) as string | null,
    };

    const inserted = await connection
      .insertInto("accounts")
      .values(accountValues)
      .returningAll()
      .executeTakeFirst();

    if (!inserted) {
      throw new Error("Failed to link account");
    }

    return mapAccount(inserted);
  },

  unlinkAccount: async ({ provider, providerAccountId }: { provider: string; providerAccountId: string }) => {
    const deleted = await connection
      .deleteFrom("accounts")
      .where("provider", "=", provider)
      .where("provider_account_id", "=", providerAccountId)
      .returningAll()
      .executeTakeFirst();

    return deleted ? mapAccount(deleted) : undefined;
  },

  createSession: async (session: AdapterSession) => {
    const sessionValues: SessionInsert = {
      user_id: session.userId,
      token: session.sessionToken,
      expires: session.expires,
    };

    const inserted = await connection
      .insertInto("sessions")
      .values(sessionValues)
      .returningAll()
      .executeTakeFirst();

    if (!inserted) {
      throw new Error("Failed to create session");
    }

    return mapSession(inserted);
  },

  getSessionAndUser: async (sessionToken) => {
    const sessionWithUser = await connection
      .selectFrom("sessions")
      .innerJoin("users", "users.id", "sessions.user_id")
      .select([
        "sessions.id as session_id",
        "sessions.token as session_token",
        "sessions.user_id as session_user_id",
        "sessions.expires as session_expires",
        "users.id as user_id",
        "users.email as user_email",
        "users.name as user_name",
        "users.role as user_role",
        "users.created_at as user_created_at",
      ])
      .where("sessions.token", "=", sessionToken)
      .executeTakeFirst();

    if (!sessionWithUser) {
      return null;
    }

    const session: AdapterSession = {
      sessionToken: sessionWithUser.session_token,
      userId: sessionWithUser.session_user_id,
      expires: sessionWithUser.session_expires,
    };

    const user: AdapterUser & { role: UserRole } = {
      id: sessionWithUser.user_id,
      email: sessionWithUser.user_email,
      emailVerified: null,
      name: sessionWithUser.user_name ?? undefined,
      role: sessionWithUser.user_role as UserRole,
    };

    return { session, user };
  },

  updateSession: async (session: AdapterSessionUpdate) => {
    const updates: Partial<Updateable<Database["sessions"]>> = {};

    if (session.expires) {
      updates.expires = session.expires;
    }

    if (session.userId) {
      updates.user_id = session.userId;
    }

    if (Object.keys(updates).length === 0) {
      const existing = await connection
        .selectFrom("sessions")
        .selectAll()
        .where("token", "=", session.sessionToken)
        .executeTakeFirst();

      return existing ? mapSession(existing) : null;
    }

    const updated = await connection
      .updateTable("sessions")
      .set(updates)
      .where("token", "=", session.sessionToken)
      .returningAll()
      .executeTakeFirst();

    return updated ? mapSession(updated) : null;
  },

  deleteSession: async (sessionToken) => {
    await connection.deleteFrom("sessions").where("token", "=", sessionToken).execute();
  },

  createVerificationToken: async (token: VerificationToken) => {
    const tokenValues: VerificationTokenInsert = {
      identifier: token.identifier,
      token: token.token,
      expires: token.expires,
    };

    const inserted = await connection
      .insertInto("verification_tokens")
      .values(tokenValues)
      .returningAll()
      .executeTakeFirst();

    if (!inserted) {
      throw new Error("Failed to create verification token");
    }

    return mapVerificationToken(inserted);
  },

  useVerificationToken: async ({ identifier, token }: Pick<VerificationToken, "identifier" | "token">) => {
    const deleted = await connection
      .deleteFrom("verification_tokens")
      .where("identifier", "=", identifier)
      .where("token", "=", token)
      .returningAll()
      .executeTakeFirst();

    return deleted ? mapVerificationToken(deleted) : null;
  },
});
