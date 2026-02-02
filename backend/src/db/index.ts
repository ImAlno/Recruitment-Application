import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenv.config());
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool, { schema });

export type Database = typeof db;
export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];

export default db;