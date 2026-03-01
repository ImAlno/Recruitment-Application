import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

/**
 * Application database configuration and Drizzle ORM setup.
 */

expand(dotenv.config());
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool, { schema });

/** Database instance type. */
export type Database = typeof db;
/** Database transaction type. */
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export default db;