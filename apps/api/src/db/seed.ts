import { eq } from 'drizzle-orm';
import { db } from './index';
import { categories, forumCategories, users } from './schema';
import { hashPassword } from '../lib/password';

async function seed() {
  console.log('Memulai seed database...');

  const existingAdmin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, 'admin@sura.app'))
    .limit(1);

  if (existingAdmin.length === 0) {
    const adminHash = await hashPassword('admin123');
    const userHash = await hashPassword('user123');

    await db.insert(users).values([
      {
        username: 'admin',
        email: 'admin@sura.app',
        passwordHash: adminHash,
        fullName: 'Administrator Sura',
        role: 'admin',
        isVerified: true,
        isActive: true,
        points: 100,
      },
      {
        username: 'warga01',
        email: 'warga@sura.app',
        passwordHash: userHash,
        fullName: 'Budi Santoso',
        role: 'user',
        isVerified: true,
        isActive: true,
        points: 45,
      },
    ]);
    console.log('✓ User demo dibuat (admin@sura.app / admin123, warga@sura.app / user123)');
  } else {
    console.log('• User demo sudah ada, dilewati');
  }

  const catCount = await db.select({ id: categories.id }).from(categories).limit(1);
  if (catCount.length === 0) {
    await db.insert(categories).values([
      { name: 'Infrastruktur', description: 'Jalan, drainase, fasilitas umum', icon: 'engineering', color: '#2196F3', sortOrder: 1 },
      { name: 'Keamanan', description: 'Kriminalitas, keamanan lingkungan', icon: 'security', color: '#F44336', sortOrder: 2 },
      { name: 'Lingkungan', description: 'Sampah, polusi, taman kota', icon: 'park', color: '#4CAF50', sortOrder: 3 },
      { name: 'Sosial', description: 'Kegiatan kemasyarakatan', icon: 'groups', color: '#FF9800', sortOrder: 4 },
      { name: 'Kesehatan', description: 'Fasilitas kesehatan', icon: 'local_hospital', color: '#9C27B0', sortOrder: 5 },
    ]);
    console.log('✓ Kategori laporan dibuat');
  }

  const forumCount = await db.select({ id: forumCategories.id }).from(forumCategories).limit(1);
  if (forumCount.length === 0) {
    await db.insert(forumCategories).values([
      { name: 'Info Warga', description: 'Informasi penting', icon: 'info', color: '#2196F3', sortOrder: 1 },
      { name: 'Diskusi Umum', description: 'Topik bebas', icon: 'forum', color: '#4CAF50', sortOrder: 2 },
      { name: 'Masalah Hot', description: 'Isu trending', icon: 'local_fire_department', color: '#F44336', sortOrder: 3 },
    ]);
    console.log('✓ Kategori forum dibuat');
  }

  console.log('Seed selesai.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
