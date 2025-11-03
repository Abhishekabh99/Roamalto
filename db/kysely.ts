import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./types";

const createDb = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Please configure it in your environment.");
  }

  const pool = new Pool({
    connectionString,
    max: parseInt(process.env.PGPOOL_MAX ?? "", 10) || 10,
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });

  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
};

declare global {
  var __roamaltoDb: Kysely<Database> | undefined;
}

export const db = globalThis.__roamaltoDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalThis.__roamaltoDb = db;
}

export type { Database };

export const destroyDb = async () => {
  if ("__roamaltoDb" in globalThis && globalThis.__roamaltoDb) {
    await globalThis.__roamaltoDb.destroy();
    globalThis.__roamaltoDb = undefined;
  } else {
    await db.destroy();
  }
};
