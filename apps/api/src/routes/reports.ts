import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { db } from '../db';
import { categories, reportComments, reports, users } from '../db/schema';
import { serializeReport } from '../lib/serializers';
import {
  optionalAuth,
  requireAuth,
  type AuthVariables,
} from '../middleware/auth';

const PUBLIC_STATUSES = ['verified', 'in_progress', 'resolved'] as const;

const createReportSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(10),
  categoryId: z.string().uuid().optional(),
  categorySlug: z
    .enum(['bencana', 'pencurian', 'event', 'lainnya', 'infrastruktur', 'keamanan', 'lingkungan'])
    .optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  imageUrls: z.array(z.string().url()).max(5).optional(),
  isAnonymous: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

const updateReportSchema = createReportSchema.partial();

const categorySlugMap: Record<string, string> = {
  bencana: 'Lingkungan',
  pencurian: 'Keamanan',
  event: 'Sosial',
  lainnya: 'Sosial',
};

async function resolveCategoryId(
  categoryId?: string,
  categorySlug?: string
): Promise<string | undefined> {
  if (categoryId) return categoryId;
  if (!categorySlug) return undefined;

  const targetName = categorySlugMap[categorySlug] ?? categorySlug;
  const [cat] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      or(
        eq(categories.name, targetName),
        sql`lower(${categories.name}) = lower(${targetName})`
      )
    )
    .limit(1);

  return cat?.id;
}

async function fetchReportById(id: string) {
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
    .where(eq(reports.id, id))
    .limit(1);

  if (!rows[0]) return null;

  const { report, category, author } = rows[0];
  return serializeReport({
    ...report,
    category,
    author,
  });
}

const reportsRoute = new Hono<{ Variables: AuthVariables }>();

reportsRoute.get('/', optionalAuth, async (c) => {
  const authUser = c.get('user');
  const limit = Math.min(Number(c.req.query('limit') ?? 20), 100);
  const status = c.req.query('status');
  const mine = c.req.query('mine') === 'true';

  const conditions = [];

  if (mine && authUser) {
    conditions.push(eq(reports.userId, authUser.sub));
  } else if (authUser && ['admin', 'moderator'].includes(authUser.role)) {
    if (status) conditions.push(eq(reports.status, status));
  } else {
    conditions.push(inArray(reports.status, [...PUBLIC_STATUSES]));
    if (status && PUBLIC_STATUSES.includes(status as (typeof PUBLIC_STATUSES)[number])) {
      conditions.push(eq(reports.status, status));
    }
  }

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

reportsRoute.get('/map', async (c) => {
  const rows = await db
    .select({
      id: reports.id,
      title: reports.title,
      status: reports.status,
      priority: reports.priority,
      latitude: reports.latitude,
      longitude: reports.longitude,
      address: reports.address,
      categoryName: categories.name,
      categoryColor: categories.color,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .where(
      and(
        inArray(reports.status, [...PUBLIC_STATUSES]),
        sql`${reports.latitude} IS NOT NULL AND ${reports.longitude} IS NOT NULL`
      )
    )
    .orderBy(desc(reports.createdAt))
    .limit(200);

  return c.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      status: r.status,
      priority: r.priority,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
      address: r.address,
      category: r.categoryName,
      categoryColor: r.categoryColor,
      createdAt: r.createdAt,
    }))
  );
});

reportsRoute.get('/my', requireAuth, async (c) => {
  const authUser = c.get('user');
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 100);

  const rows = await db
    .select({
      report: reports,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .where(eq(reports.userId, authUser.sub))
    .orderBy(desc(reports.createdAt))
    .limit(limit);

  return c.json(
    rows.map(({ report, category }) => serializeReport({ ...report, category }))
  );
});

reportsRoute.get('/:id', optionalAuth, async (c) => {
  const id = c.req.param('id');
  const authUser = c.get('user');

  const [row] = await db
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
    .where(eq(reports.id, id))
    .limit(1);

  if (!row) return c.json({ error: 'Laporan tidak ditemukan' }, 404);

  const { report, category, author } = row;
  const isOwner = authUser?.sub === report.userId;
  const isAdmin = authUser && ['admin', 'moderator'].includes(authUser.role);
  const isPublic = PUBLIC_STATUSES.includes(
    report.status as (typeof PUBLIC_STATUSES)[number]
  );

  if (!isPublic && !isOwner && !isAdmin) {
    return c.json({ error: 'Laporan belum diverifikasi atau tidak dapat diakses' }, 403);
  }

  await db
    .update(reports)
    .set({ viewCount: sql`${reports.viewCount} + 1` })
    .where(eq(reports.id, id));

  return c.json(serializeReport({ ...report, category, author }));
});

reportsRoute.post(
  '/',
  requireAuth,
  zValidator('json', createReportSchema),
  async (c) => {
    const authUser = c.get('user');
    const body = c.req.valid('json');

    const categoryId = await resolveCategoryId(body.categoryId, body.categorySlug);

    const [created] = await db
      .insert(reports)
      .values({
        title: body.title,
        description: body.description,
        categoryId,
        userId: authUser.sub,
        latitude: String(body.latitude),
        longitude: String(body.longitude),
        address: body.address,
        city: body.city,
        province: body.province,
        imageUrls: body.imageUrls ?? [],
        isAnonymous: body.isAnonymous ?? false,
        priority: body.priority ?? 'medium',
        status: 'pending',
      })
      .returning();

    const report = await fetchReportById(created.id);
    return c.json(report, 201);
  }
);

reportsRoute.put(
  '/:id',
  requireAuth,
  zValidator('json', updateReportSchema),
  async (c) => {
    const authUser = c.get('user');
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const [existing] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);

    if (!existing) return c.json({ error: 'Laporan tidak ditemukan' }, 404);

    const isOwner = existing.userId === authUser.sub;
    const isAdmin = ['admin', 'moderator'].includes(authUser.role);

    if (!isOwner && !isAdmin) {
      return c.json({ error: 'Tidak dapat mengubah laporan orang lain' }, 403);
    }

    if (!isAdmin && existing.status !== 'pending') {
      return c.json({ error: 'Laporan yang sudah diproses tidak dapat diubah' }, 403);
    }

    const categoryId =
      body.categoryId || body.categorySlug
        ? await resolveCategoryId(body.categoryId, body.categorySlug)
        : undefined;

    await db
      .update(reports)
      .set({
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(categoryId && { categoryId }),
        ...(body.latitude !== undefined && { latitude: String(body.latitude) }),
        ...(body.longitude !== undefined && { longitude: String(body.longitude) }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.province !== undefined && { province: body.province }),
        ...(body.imageUrls && { imageUrls: body.imageUrls }),
        ...(body.isAnonymous !== undefined && { isAnonymous: body.isAnonymous }),
        ...(body.priority && { priority: body.priority }),
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id));

    const report = await fetchReportById(id);
    return c.json(report);
  }
);

reportsRoute.delete('/:id', requireAuth, async (c) => {
  const authUser = c.get('user');
  const id = c.req.param('id');

  const [existing] = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  if (!existing) return c.json({ error: 'Laporan tidak ditemukan' }, 404);

  const isOwner = existing.userId === authUser.sub;
  const isAdmin = ['admin', 'moderator'].includes(authUser.role);

  if (!isOwner && !isAdmin) {
    return c.json({ error: 'Tidak dapat menghapus laporan orang lain' }, 403);
  }

  if (!isAdmin && existing.status !== 'pending') {
    return c.json({ error: 'Laporan yang sudah diproses tidak dapat dihapus' }, 403);
  }

  await db.delete(reports).where(eq(reports.id, id));
  return c.json({ message: 'Laporan berhasil dihapus' });
});

// ===== Comments / Discussion =====

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
});

reportsRoute.get('/:id/comments', optionalAuth, async (c) => {
  const id = c.req.param('id');
  const rows = await db
    .select({
      comment: reportComments,
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
    .from(reportComments)
    .leftJoin(users, eq(reportComments.userId, users.id))
    .where(eq(reportComments.reportId, id))
    .orderBy(reportComments.createdAt);

  return c.json(
    rows.map(({ comment, author }) => ({
      id: comment.id,
      content: comment.content,
      isOfficial: comment.isOfficial,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      author,
    }))
  );
});

reportsRoute.post(
  '/:id/comments',
  requireAuth,
  zValidator('json', createCommentSchema),
  async (c) => {
    const authUser = c.get('user');
    const id = c.req.param('id');
    const body = c.req.valid('json');

    const [report] = await db
      .select({ id: reports.id })
      .from(reports)
      .where(eq(reports.id, id))
      .limit(1);
    if (!report) return c.json({ error: 'Laporan tidak ditemukan' }, 404);

    const [created] = await db
      .insert(reportComments)
      .values({
        reportId: id,
        userId: authUser.sub,
        content: body.content,
        parentId: body.parentId,
        isOfficial: ['admin', 'moderator'].includes(authUser.role),
      })
      .returning();

    await db
      .update(reports)
      .set({ commentCount: sql`${reports.commentCount} + 1` })
      .where(eq(reports.id, id));

    const [author] = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, authUser.sub))
      .limit(1);

    return c.json(
      {
        id: created.id,
        content: created.content,
        isOfficial: created.isOfficial,
        parentId: created.parentId,
        createdAt: created.createdAt,
        author,
      },
      201
    );
  }
);

export default reportsRoute;
