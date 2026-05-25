import * as SQLite from 'expo-sqlite';

export const expoSQLite = SQLite.openDatabaseSync('sura.db');

export async function initializeTables() {
  await expoSQLite.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      avatar_url TEXT,
      points INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category_id TEXT,
      user_id TEXT,
      status TEXT DEFAULT 'pending',
      latitude REAL,
      longitude REAL,
      address TEXT,
      image_urls TEXT DEFAULT '[]',
      is_anonymous INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      sync_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS offline_sync_queue (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      entity_type TEXT NOT NULL,
      entity_data TEXT NOT NULL,
      action TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      sync_status TEXT DEFAULT 'pending'
    );
  `);
}

export const dbHelpers = {
  async createReport(reportData: Record<string, unknown>) {
    const id = String(reportData.id ?? `local_${Date.now()}`);
    await expoSQLite.runAsync(
      `INSERT OR REPLACE INTO reports (id, title, description, category_id, user_id, status, latitude, longitude, address, image_urls, is_anonymous, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(reportData.title ?? ''),
        String(reportData.description ?? ''),
        reportData.categoryId ? String(reportData.categoryId) : null,
        reportData.userId ? String(reportData.userId) : null,
        String(reportData.status ?? 'pending'),
        typeof reportData.latitude === 'number' ? reportData.latitude : null,
        typeof reportData.longitude === 'number' ? reportData.longitude : null,
        reportData.address ? String(reportData.address) : null,
        JSON.stringify(reportData.imageUrls ?? []),
        reportData.isAnonymous ? 1 : 0,
        String(reportData.syncStatus ?? 'pending'),
      ]
    );
  },

  async getSyncQueue() {
    return expoSQLite.getAllAsync(
      'SELECT * FROM offline_sync_queue WHERE sync_status = ? ORDER BY created_at',
      ['pending']
    );
  },

  async markSyncItemAsSynced(id: string) {
    await expoSQLite.runAsync(
      'UPDATE offline_sync_queue SET sync_status = ? WHERE id = ?',
      ['synced', id]
    );
  },

  async syncCategories(categories: Array<Record<string, unknown>>) {
    await expoSQLite.runAsync('DELETE FROM categories');
    for (const category of categories) {
      await expoSQLite.runAsync(
        `INSERT INTO categories (id, name, description, icon, color, is_active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          String(category.id),
          String(category.name),
          category.description ? String(category.description) : null,
          category.icon ? String(category.icon) : null,
          category.color ? String(category.color) : null,
          category.isActive ? 1 : 0,
          Number(category.sortOrder ?? 0),
        ]
      );
    }
  },

  async addToSyncQueue(item: {
    id: string;
    userId?: string;
    entityType: string;
    entityData: Record<string, unknown>;
    action: string;
  }) {
    await expoSQLite.runAsync(
      `INSERT INTO offline_sync_queue (id, user_id, entity_type, entity_data, action, sync_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.userId ?? null,
        item.entityType,
        JSON.stringify(item.entityData),
        item.action,
        'pending',
      ]
    );
  },
};
