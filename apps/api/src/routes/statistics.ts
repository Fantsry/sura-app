import { Hono } from 'hono';
import { count, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db';
import { categories, reports } from '../db/schema';

const PUBLIC_STATUSES = ['verified', 'in_progress', 'resolved'] as const;

const statistics = new Hono();

statistics.get('/public', async (c) => {
  const [total] = await db.select({ count: count() }).from(reports);
  const [verified] = await db
    .select({ count: count() })
    .from(reports)
    .where(inArray(reports.status, [...PUBLIC_STATUSES]));
  const [resolved] = await db
    .select({ count: count() })
    .from(reports)
    .where(eq(reports.status, 'resolved'));
  const [pending] = await db
    .select({ count: count() })
    .from(reports)
    .where(eq(reports.status, 'pending'));

  const byCategory = await db
    .select({
      name: categories.name,
      color: categories.color,
      count: count(),
    })
    .from(reports)
    .leftJoin(categories, eq(reports.categoryId, categories.id))
    .where(inArray(reports.status, [...PUBLIC_STATUSES]))
    .groupBy(categories.name, categories.color);

  const mapPoints = await db
    .select({
      latitude: reports.latitude,
      longitude: reports.longitude,
      status: reports.status,
    })
    .from(reports)
    .where(
      sql`${reports.latitude} IS NOT NULL AND ${reports.longitude} IS NOT NULL AND ${reports.status} IN ('verified', 'in_progress', 'resolved')`
    )
    .limit(500);

  const monthlyRaw = await db.execute(sql`
    SELECT to_char(created_at, 'YYYY-MM') as month, COUNT(*)::int as count
    FROM reports
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `);

  const monthly = Array.isArray(monthlyRaw) ? monthlyRaw : (monthlyRaw as any).rows ?? [];
  const totalCount = total.count;
  const resolvedCount = resolved.count;

  return c.json({
    totalReports: totalCount,
    verifiedReports: verified.count,
    resolvedReports: resolvedCount,
    pendingReports: pending.count,
    resolutionRate:
      totalCount > 0 ? Math.round((resolvedCount / totalCount) * 1000) / 10 : 0,
    byCategory,
    monthly,
    mapPoints: mapPoints.map((p) => ({
      latitude: p.latitude ? Number(p.latitude) : null,
      longitude: p.longitude ? Number(p.longitude) : null,
      status: p.status,
    })),
  });
});

export default statistics;
