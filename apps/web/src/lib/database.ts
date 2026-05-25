import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Connection configuration
const connectionString = process.env.DATABASE_URL || 
  "postgresql://sura_user:your_secure_password@localhost:5432/sura_db";

// Create connection pool
const client = postgres(connectionString, { 
  max: 10, // Maximum number of connections
  idle_timeout: 20,
  connect_timeout: 10
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export for use in other files
export { schema };
export default db;
