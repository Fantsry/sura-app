import { eq } from 'drizzle-orm';
import { db } from './index';
import {
  categories,
  forumCategories,
  forumPosts,
  newsArticles,
  reports,
  users,
} from './schema';
import { hashPassword } from '../lib/password';

async function seed() {
  console.log('Memulai seed database...');

  const existingAdmin = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, 'admin@sura.app'))
    .limit(1);

  let adminId: string;
  let userId: string;

  if (existingAdmin.length === 0) {
    const adminHash = await hashPassword('admin123');
    const userHash = await hashPassword('user123');

    const inserted = await db
      .insert(users)
      .values([
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
          phoneNumber: '+62 812-3456-7890',
        },
      ])
      .returning({ id: users.id, role: users.role });
    adminId = inserted.find((u) => u.role === 'admin')!.id;
    userId = inserted.find((u) => u.role === 'user')!.id;
    console.log('✓ User demo dibuat (admin@sura.app / admin123, warga@sura.app / user123)');
  } else {
    const all = await db.select({ id: users.id, role: users.role }).from(users);
    adminId = all.find((u) => u.role === 'admin')!.id;
    userId = all.find((u) => u.role === 'user')?.id ?? adminId;
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

  // -------- Sample reports (seeded once) --------
  const reportCount = await db.select({ id: reports.id }).from(reports).limit(1);
  if (reportCount.length === 0) {
    const cats = await db.select().from(categories);
    const byName = (n: string) => cats.find((c) => c.name === n)?.id;

    await db.insert(reports).values([
      {
        title: 'Pohon tumbang menutup jalan utama',
        description:
          'Pohon besar tumbang akibat angin kencang di kawasan pemukiman. Akses jalan utama terhambat total dan beberapa kabel listrik ikut terputus.',
        categoryId: byName('Lingkungan'),
        userId,
        status: 'verified',
        priority: 'high',
        latitude: '-6.20100000',
        longitude: '106.81700000',
        address: 'Jl. Merdeka Barat, Jakarta Pusat',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
      },
      {
        title: 'Lampu jalan padat mati di Jalan Sudirman',
        description:
          'Sudah 3 hari lampu PJU di sepanjang Jalan Sudirman tidak menyala. Mohon perbaikan segera demi keamanan pengguna jalan malam.',
        categoryId: byName('Infrastruktur'),
        userId,
        status: 'in_progress',
        priority: 'medium',
        latitude: '-6.22500000',
        longitude: '106.80900000',
        address: 'Jl. Jend. Sudirman, Jakarta',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
      },
      {
        title: 'Sampah menumpuk di TPS Pasar Jaya',
        description:
          'Tumpukan sampah belum diangkut hampir seminggu. Bau menyengat dan menarik lalat. Mengganggu pedagang dan warga sekitar.',
        categoryId: byName('Lingkungan'),
        userId,
        status: 'verified',
        priority: 'medium',
        latitude: '-6.18700000',
        longitude: '106.82200000',
        address: 'TPS Pasar Jaya, Tanah Abang',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
      },
      {
        title: 'CCTV merekam pencurian motor di parkiran',
        description:
          'Terjadi pencurian sepeda motor pada pukul 14:30. Pelaku berjumlah 2 orang, terekam jelas oleh CCTV pos satpam.',
        categoryId: byName('Keamanan'),
        userId,
        status: 'in_progress',
        priority: 'high',
        latitude: '-6.21500000',
        longitude: '106.84500000',
        address: 'Parkiran Pasar Jaya, Senen',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
      },
      {
        title: 'Pipa air bocor menggenangi jalan',
        description:
          'Pipa PDAM bocor sejak dini hari, genangan air setinggi 10 cm di jalan raya. Aliran air ke pemukiman warga juga terganggu.',
        categoryId: byName('Infrastruktur'),
        userId,
        status: 'resolved',
        priority: 'urgent',
        latitude: '-6.17540000',
        longitude: '106.82720000',
        address: 'Jl. Merdeka No. 42, Jakarta Pusat',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        resolvedAt: new Date(),
      },
      {
        title: 'Gotong royong kebersihan persiapan 17-an',
        description:
          'Warga RW 08 berkumpul untuk membersihkan balai desa dan lingkungan sekitar menjelang peringatan kemerdekaan.',
        categoryId: byName('Sosial'),
        userId,
        status: 'resolved',
        priority: 'low',
        latitude: '-6.19800000',
        longitude: '106.83000000',
        address: 'Balai RW 08, Menteng',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        resolvedAt: new Date(),
      },
      {
        title: 'Lubang besar di tengah jalan membahayakan',
        description:
          'Lubang sedalam ~30cm di Jalan Sabang sudah memakan korban. Pengendara motor terjatuh dua hari lalu. Mohon segera ditambal.',
        categoryId: byName('Infrastruktur'),
        userId,
        status: 'pending',
        priority: 'high',
        latitude: '-6.18400000',
        longitude: '106.82800000',
        address: 'Jl. Sabang, Jakarta Pusat',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
      },
      {
        title: 'Pencurian helm di area kampus',
        description:
          'Banyak helm hilang di area parkir kampus. Mohon dipasang CCTV tambahan dan ditingkatkan patroli sekuriti.',
        categoryId: byName('Keamanan'),
        userId,
        status: 'pending',
        priority: 'medium',
        latitude: '-6.36100000',
        longitude: '106.82400000',
        address: 'Kampus Universitas X, Depok',
        city: 'Depok',
        province: 'Jawa Barat',
      },
    ]);
    console.log('✓ Sample laporan dibuat');
  }

  // -------- Sample news articles --------
  const newsCount = await db.select({ id: newsArticles.id }).from(newsArticles).limit(1);
  if (newsCount.length === 0) {
    console.log('• Tabel berita kosong. Menunggu input dari admin.');
  }

  // -------- Sample forum posts --------
  const fpCount = await db.select({ id: forumPosts.id }).from(forumPosts).limit(1);
  if (fpCount.length === 0) {
    const fcs = await db.select().from(forumCategories);
    const fByName = (n: string) => fcs.find((c) => c.name === n)?.id;

    await db.insert(forumPosts).values([
      {
        title: 'Rencana pembangunan taman kota baru di blok B, ada yang sudah dengar detailnya?',
        content:
          'Katanya akan ada fasilitas jogging track dan playground, tapi beberapa warga khawatir soal lahan parkir. Mari kita kawal bareng supaya tetap rapi.',
        userId,
        categoryId: fByName('Info Warga'),
        tags: ['infowarga', 'pembangunan'],
      },
      {
        title: 'Kenapa lampu jalan di sepanjang Jalan Merdeka mati setiap jam 12 malam tepat?',
        content:
          'Sudah seminggu ini kejadiannya sama terus. Ada yang tahu ini masalah teknis atau ada jadwal pemadaman khusus? Agak ngeri kalau lewat sana tengah malam.',
        userId,
        categoryId: fByName('Masalah Hot'),
        tags: ['konspirasi', 'lampu-jalan'],
      },
      {
        title: 'Rekomendasi tempat kuliner murah dekat balai kota?',
        content:
          'Lagi cari warteg atau warkop yang bukanya 24 jam, harga ramah kantong, dekat balai kota. Mohon rekomendasinya, terima kasih warga sekalian.',
        userId,
        categoryId: fByName('Diskusi Umum'),
        tags: ['kuliner', 'rekomendasi'],
      },
    ]);
    console.log('✓ Sample postingan forum dibuat');
  }

  console.log('Seed selesai.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
