import { drizzle } from "drizzle-orm/neon-http";

import { relations } from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(connectionString, { relations });
export type DbClient = typeof db;
