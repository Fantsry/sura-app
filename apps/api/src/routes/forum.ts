import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { forumCategories, forumComments, forumPosts, users } from '../db/schema';
import { requireAuth, type AuthVariables } from '../middleware/auth';

const createPostSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(10),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

const createCommentSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

const forum = new Hono<{ Variables: AuthVariables }>();

forum.get('/categories', async (c) => {
  const rows = await db
    .select()
    .from(forumCategories)
    .where(eq(forumCategories.isActive, true))
    .orderBy(forumCategories.sortOrder);
  return c.json(rows);
});

forum.get('/posts', async (c) => {
  const limit = Math.min(Number(c.req.query('limit') ?? 30), 100);
  const categoryId = c.req.query('categoryId');

  const rows = await db
    .select({
      post: forumPosts,
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
      category: {
        id: forumCategories.id,
        name: forumCategories.name,
        color: forumCategories.color,
      },
    })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.userId, users.id))
    .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
    .where(categoryId ? eq(forumPosts.categoryId, categoryId) : undefined)
    .orderBy(desc(forumPosts.isPinned), desc(forumPosts.createdAt))
    .limit(limit);

  return c.json(
    rows.map(({ post, author, category }) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      isPinned: post.isPinned,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      tags: post.tags,
      createdAt: post.createdAt,
      author,
      category,
    }))
  );
});

forum.get('/posts/:id', async (c) => {
  const id = c.req.param('id');

  const [row] = await db
    .select({
      post: forumPosts,
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
      category: {
        id: forumCategories.id,
        name: forumCategories.name,
        color: forumCategories.color,
      },
    })
    .from(forumPosts)
    .leftJoin(users, eq(forumPosts.userId, users.id))
    .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
    .where(eq(forumPosts.id, id))
    .limit(1);

  if (!row) return c.json({ error: 'Postingan tidak ditemukan' }, 404);

  const comments = await db
    .select({
      comment: forumComments,
      author: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(forumComments)
    .leftJoin(users, eq(forumComments.userId, users.id))
    .where(eq(forumComments.postId, id))
    .orderBy(forumComments.createdAt);

  return c.json({
    ...row.post,
    author: row.author,
    category: row.category,
    comments: comments.map(({ comment, author }) => ({
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      author,
    })),
  });
});

forum.post(
  '/posts',
  requireAuth,
  zValidator('json', createPostSchema),
  async (c) => {
    const authUser = c.get('user');
    const body = c.req.valid('json');

    const [created] = await db
      .insert(forumPosts)
      .values({
        title: body.title,
        content: body.content,
        userId: authUser.sub,
        categoryId: body.categoryId,
        tags: body.tags ?? [],
      })
      .returning();

    return c.json(created, 201);
  }
);

forum.post(
  '/posts/:id/comments',
  requireAuth,
  zValidator('json', createCommentSchema),
  async (c) => {
    const authUser = c.get('user');
    const postId = c.req.param('id');
    const body = c.req.valid('json');

    const [post] = await db
      .select({ id: forumPosts.id })
      .from(forumPosts)
      .where(eq(forumPosts.id, postId))
      .limit(1);

    if (!post) return c.json({ error: 'Postingan tidak ditemukan' }, 404);

    const [created] = await db
      .insert(forumComments)
      .values({
        postId,
        userId: authUser.sub,
        content: body.content,
        parentId: body.parentId,
      })
      .returning();

    return c.json(created, 201);
  }
);

export default forum;
