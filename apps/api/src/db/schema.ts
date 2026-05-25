import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  role: varchar('role', { length: 20 }).default('user'),
  avatarUrl: text('avatar_url'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  points: integer('points').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 7 }),
  isActive: boolean('is_active').default(true),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  userId: uuid('user_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('pending'),
  priority: varchar('priority', { length: 10 }).default('medium'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  imageUrls: jsonb('image_urls').$type<string[]>().default([]),
  videoUrl: text('video_url'),
  isAnonymous: boolean('is_anonymous').default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});

export const reportComments = pgTable('report_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  isOfficial: boolean('is_official').default(false),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const newsArticles = pgTable('news_articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  authorId: uuid('author_id').references(() => users.id),
  category: varchar('category', { length: 100 }),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').default(false),
  isFeatured: boolean('is_featured').default(false),
  viewCount: integer('view_count').default(0),
  tags: jsonb('tags').$type<string[]>().default([]),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumCategories = pgTable('forum_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  userId: uuid('user_id').references(() => users.id),
  categoryId: uuid('category_id').references(() => forumCategories.id),
  isPinned: boolean('is_pinned').default(false),
  isLocked: boolean('is_locked').default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const forumComments = pgTable('forum_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => forumPosts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  parentId: uuid('parent_id'),
  likeCount: integer('like_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  relatedId: uuid('related_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
