// src/config/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "recruit-db",
    password: "test",
    port: parseInt("5432"),
});

export default pool;