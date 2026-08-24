import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      // Mendukung DATABASE_URL atau konfigurasi terpisah secara aman
      connectionString: process.env.DATABASE_URL,
      host: process.env.SQL_HOST || 'localhost',
      user: process.env.SQL_USER || process.env.SQL_ADMIN_USER || 'postgres',
      password: process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD || 'faris123',
      database: process.env.SQL_DB_NAME || 'web_layanan',
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });