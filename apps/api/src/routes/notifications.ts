import { Hono } from 'hono';
import { desc, eq, and } from 'drizzle-orm';
import { db } from '../db';
import { notifications } from '../db/schema';
import { requireAuth, type AuthVariables } from '../middleware/auth';

const notificationsRoute = new Hono<{ Variables: AuthVariables }>();

notificationsRoute.use('*', requireAuth);

// Get all notifications for current user
notificationsRoute.get('/', async (c) => {
  const user = c.get('user');
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 100);

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.sub))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);

  const unreadCount = rows.filter((n) => !n.isRead).length;

  return c.json({ notifications: rows, unreadCount });
});

// Mark a single notification as read
notificationsRoute.patch('/:id/read', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');

  const [existing] = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.sub)))
    .limit(1);

  if (!existing) return c.json({ error: 'Notifikasi tidak ditemukan' }, 404);

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, id));

  return c.json({ message: 'Notifikasi ditandai dibaca' });
});

// Mark all notifications as read
notificationsRoute.post('/read-all', async (c) => {
  const user = c.get('user');

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, user.sub), eq(notifications.isRead, false)));

  return c.json({ message: 'Semua notifikasi ditandai dibaca' });
});

export default notificationsRoute;
