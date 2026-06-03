import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { newsArticles, users } from '../db/schema';
import {
  requireAdmin,
  requireAuth,
  type AuthVariables,
} from '../middleware/auth';

const createNewsSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(20),
  excerpt: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

const news = new Hono<{ Variables: AuthVariables }>();

news.get('/', async (c) => {
  const featured = c.req.query('featured') === 'true';
  const limit = Math.min(Number(c.req.query('limit') ?? 20), 50);

  const rows = await db
    .select({
      article: newsArticles,
      author: {
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(newsArticles)
    .leftJoin(users, eq(newsArticles.authorId, users.id))
    .where(eq(newsArticles.isPublished, true))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(limit);

  const filtered = featured
    ? rows.filter((r) => r.article.isFeatured)
    : rows;

  return c.json(
    filtered.map(({ article, author }) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      isFeatured: article.isFeatured,
      viewCount: article.viewCount,
      tags: article.tags,
      publishedAt: article.publishedAt,
      author: author?.fullName ?? 'Admin Sura',
    }))
  );
});

news.get('/:id', async (c) => {
  const id = c.req.param('id');

  const [row] = await db
    .select({
      article: newsArticles,
      author: {
        id: users.id,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(newsArticles)
    .leftJoin(users, eq(newsArticles.authorId, users.id))
    .where(eq(newsArticles.id, id))
    .limit(1);

  if (!row || !row.article.isPublished) {
    return c.json({ error: 'Artikel tidak ditemukan' }, 404);
  }

  // bump view count (fire and forget)
  db.update(newsArticles)
    .set({ viewCount: (row.article.viewCount ?? 0) + 1 })
    .where(eq(newsArticles.id, id))
    .catch(() => {});

  return c.json({
    id: row.article.id,
    title: row.article.title,
    excerpt: row.article.excerpt,
    content: row.article.content,
    category: row.article.category,
    imageUrl: row.article.imageUrl,
    isFeatured: row.article.isFeatured,
    viewCount: (row.article.viewCount ?? 0) + 1,
    tags: row.article.tags,
    publishedAt: row.article.publishedAt,
    author: row.author?.fullName ?? 'Admin Sura',
    authorAvatar: row.author?.avatarUrl ?? null,
  });
});

news.post(
  '/',
  requireAuth,
  requireAdmin,
  zValidator('json', createNewsSchema),
  async (c) => {
    const authUser = c.get('user');
    const body = c.req.valid('json');

    const [created] = await db
      .insert(newsArticles)
      .values({
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        category: body.category,
        imageUrl: body.imageUrl,
        authorId: authUser.sub,
        isPublished: body.isPublished ?? true,
        isFeatured: body.isFeatured ?? false,
        tags: body.tags ?? [],
        publishedAt: body.isPublished !== false ? new Date() : null,
      })
      .returning();

    return c.json(created, 201);
  }
);

export default news;
