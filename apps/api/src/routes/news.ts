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
