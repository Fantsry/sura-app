# PostgreSQL Setup Guide for SURA Application

## Prerequisites

1. **PostgreSQL** (version 13 or higher)
2. **PostGIS** extension for geospatial data
3. **Node.js** and **Bun** (already installed)

## Installation

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### 2. Setup Database User and Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database user
CREATE USER sura_user WITH PASSWORD 'your_secure_password';

# Create database
CREATE DATABASE sura_db OWNER sura_user;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sura_db TO sura_user;

# Exit
\q
```

### 3. Install PostGIS Extension

```bash
# Connect to your database
psql -U sura_user -d sura_db

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Verify installation
\dx
```

### 4. Run Database Schema

```bash
# Navigate to project root
cd /Users/admin/Documents/XI\ Semester\ 2/asesmen_2026/sura-app

# Execute schema
psql -U sura_user -d sura_db -f database/schema.sql
```

## Environment Configuration

Create `.env` file in project root:

```env
# Database Configuration
DATABASE_URL=postgresql://sura_user:your_secure_password@localhost:5432/sura_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sura_db
DB_USER=sura_user
DB_PASSWORD=your_secure_password

# Application Configuration
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_key_here

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Push Notifications (optional)
FCM_SERVER_KEY=your_fcm_server_key
```

## Database Connection Setup

### 1. Install Required Packages

```bash
cd apps/web
bun add pg @types/pg
bun add drizzle-orm drizzle-kit
bun add dotenv
```

### 2. Create Database Configuration

Create `apps/web/src/lib/database.ts`:

```typescript
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
```

### 3. Create Drizzle Schema

Create `apps/web/src/lib/schema.ts` (this will be automatically generated from SQL schema):

```typescript
import { pgTable, uuid, varchar, text, boolean, integer, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  role: varchar('role', { length: 20 }).default('user'),
  avatarUrl: text('avatar_url'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  points: integer('points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLogin: timestamp('last_login')
});

// Add other table definitions here...
```

## Mobile App Database Integration

### 1. SQLite for Offline Storage (Mobile)

For mobile apps, we'll use SQLite for offline storage with sync to PostgreSQL:

```bash
cd apps/mobile
bun add expo-sqlite
bun add drizzle-orm drizzle-kit
```

### 2. Create Mobile Database Config

Create `apps/mobile/src/lib/database.ts`:

```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

// Initialize SQLite database
export const expoSQLite = SQLite.openDatabaseSync('sura.db');

// Create drizzle instance
export const db = drizzle(expoSQLite);

// Migration function
export async function migrateDb() {
  try {
    await migrate(db, migrations);
    console.log('Database migrated successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
  }
}
```

### 3. Sync Strategy

Create sync service in `apps/mobile/src/services/sync.ts`:

```typescript
import { db } from '../lib/database';
import { API_BASE_URL } from '../config/api';

export class SyncService {
  // Sync offline data to server
  async syncToServer() {
    const pendingReports = await db.select().from(reports)
      .where(eq(reports.syncStatus, 'pending'));
    
    for (const report of pendingReports) {
      try {
        await fetch(`${API_BASE_URL}/api/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        });
        
        // Update sync status
        await db.update(reports)
          .set({ syncStatus: 'synced' })
          .where(eq(reports.id, report.id));
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
  
  // Sync data from server
  async syncFromServer() {
    // Implementation for server-to-client sync
  }
}
```

## Testing the Setup

### 1. Test Database Connection

Create `apps/web/src/test-db.ts`:

```typescript
import db from './lib/database';

async function testConnection() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log('Database connected successfully!');
    console.log('Users:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
```

### 2. Run Test

```bash
cd apps/web
bun run test-db.ts
```

## Production Considerations

### 1. Database Security

- Use SSL connections in production
- Implement connection pooling
- Set up proper user permissions
- Enable database logging

### 2. Performance Optimization

- Add proper indexes (already included in schema)
- Implement database connection pooling
- Use read replicas for high traffic
- Implement caching strategies

### 3. Backup Strategy

```bash
# Create backup
pg_dump -U sura_user -h localhost sura_db > backup.sql

# Restore backup
psql -U sura_user -h localhost sura_db < backup.sql

# Automated backup script (add to cron)
0 2 * * * pg_dump -U sura_user -h localhost sura_db > /backups/sura_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Check if PostgreSQL is running
2. **Authentication failed**: Verify user credentials
3. **Permission denied**: Check database privileges
4. **PostGIS not found**: Install PostGIS extension

### Useful Commands

```bash
# Check PostgreSQL status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Connect to database
psql -U sura_user -d sura_db

# List tables
\dt

# Check extensions
\dx

# Reset database
DROP DATABASE sura_db;
CREATE DATABASE sura_db OWNER sura_user;
```

## Next Steps

1. Set up PostgreSQL following the guide
2. Run the schema file to create tables
3. Configure environment variables
4. Test database connection
5. Implement API endpoints
6. Set up mobile sync functionality
