import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { categories, notifications, reports, users } from '../db/schema';
import { serializeReport, serializeUser } from '../lib/serializers';
import {
  requireAdmin,
  requireAuth,
  type AuthVariables,
} from '../middleware/auth';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'verified', 'in_progress', 'resolved', 'rejected']),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

const updateUserSchema = z.object({
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

const admin = new Hono<{ Variables: AuthVariables }>();

admin.use('*', requireAuth, requireAdmin);

admin.get('/dashboard', async (c) => {
  const [totalReports] = await db.select({ count: count() }).from(reports);
  const [pendingReports] = await db
    .select({ count: count() })
    .from(reports)
    .where(eq(reports.status, 'pending'));
  const [verifiedReports] = await db
    .select({ count: count() })
    .from(reports)
    .where(eq(reports.status, 'verified'));
  const [resolvedReports] = await db
    .select({ count: count() })
    .from(reports)
    .where(eq(reports.status, 'resolved'));
  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [activeUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.isActive, true));

  const recentPending = await db
    .select({
      report: reports,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
      },
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .leftJoin(users, eq(reports.userId, users.id))
    .where(eq(reports.status, 'pending'))
    .orderBy(desc(reports.createdAt))
    .limit(10);

  return c.json({
    stats: {
      totalReports: totalReports.count,
      pendingReports: pendingReports.count,
      verifiedReports: verifiedReports.count,
      resolvedReports: resolvedReports.count,
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
    },
    pendingReports: recentPending.map(({ report, category, author }) =>
      serializeReport({ ...report, category, author })
    ),
  });
});

admin.get('/reports', async (c) => {
  const status = c.req.query('status');
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 200);

  const conditions = status ? [eq(reports.status, status)] : [];

  const rows = await db
    .select({
      report: reports,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .leftJoin(users, eq(reports.userId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(reports.createdAt))
    .limit(limit);

  return c.json(
    rows.map(({ report, category, author }) =>
      serializeReport({ ...report, category, author })
    )
  );
});

admin.patch(
  '/reports/:id/status',
  zValidator('json', updateStatusSchema),
  async (c) => {
    const adminUser = c.get('user');
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const [existing] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!existing) return c.json({ error: 'Laporan tidak ditemukan' }, 404);

    await db
      .update(reports)
      .set({
        status: body.status,
        ...(body.priority && { priority: body.priority }),
        ...(body.status === 'resolved' && { resolvedAt: new Date() }),
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id));

    if (existing.userId) {
      const statusLabels: Record<string, string> = {
        verified: 'diverifikasi',
        in_progress: 'sedang ditangani',
        resolved: 'selesai ditangani',
        rejected: 'ditolak',
        pending: 'menunggu verifikasi',
      };

      await db.insert(notifications).values({
        userId: existing.userId,
        title: 'Update Status Laporan',
        message: `Laporan "${existing.title}" telah ${statusLabels[body.status] ?? 'diperbarui'}.${body.notes ? ` Catatan: ${body.notes}` : ''}`,
        type: 'report_update',
        relatedId: id,
      });
    }

    const [updated] = await db
      .select({
        report: reports,
        category: {
          id: categories.id,
          name: categories.name,
          color: categories.color,
        },
        author: {
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reports)
      .leftJoin(categories, eq(reports.categoryId, categories.id))
      .leftJoin(users, eq(reports.userId, users.id))
      .where(eq(reports.id, id))
      .limit(1);

    const { report, category, author } = updated;
    return c.json(serializeReport({ ...report, category, author }));
  }
);

admin.get('/users', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 200);
  const role = c.req.query('role');

  const rows = await db
    .select()
    .from(users)
    .where(role ? eq(users.role, role) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(limit);

  return c.json(rows.map((u) => serializeUser(u, true)));
});

admin.patch(
  '/users/:id',
  zValidator('json', updateUserSchema),
  async (c) => {
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) return c.json({ error: 'Pengguna tidak ditemukan' }, 404);

    const [updated] = await db
      .update(users)
      .set({
        ...(body.role && { role: body.role }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isVerified !== undefined && { isVerified: body.isVerified }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return c.json(serializeUser(updated, true));
  }
);

admin.get('/statistics', async (c) => {
  const byStatus = await db
    .select({ status: reports.status, count: count() })
    .from(reports)
    .groupBy(reports.status);

  const byCategory = await db
    .select({
      category: categories.name,
      color: categories.color,
      count: count(),
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .groupBy(categories.name, categories.color);

  const monthlyRaw = await db.execute(sql`
    SELECT to_char(created_at, 'YYYY-MM') as month, COUNT(*)::int as count
    FROM reports
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `);

  const monthly = Array.isArray(monthlyRaw) ? monthlyRaw : (monthlyRaw as any).rows ?? [];

  return c.json({
    byStatus,
    byCategory,
    monthly,
  });
});

export default admin;
