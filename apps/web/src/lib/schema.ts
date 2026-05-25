import { pgTable, uuid, varchar, text, boolean, integer, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';

// Users table
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLogin: timestamp('last_login')
});

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  postalCode: varchar('postal_code', { length: 10 }),
  birthDate: timestamp('birth_date'),
  gender: varchar('gender', { length: 10 }),
  preferences: jsonb('preferences').default('{}'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Categories table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 7 }),
  isActive: boolean('is_active').default(true),
  parentId: uuid('parent_id').references(() => categories.id),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow()
});

// Reports table
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
  imageUrls: jsonb('image_urls').default('[]'),
  videoUrl: text('video_url'),
  isAnonymous: boolean('is_anonymous').default(false),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
});

// Report comments table
export const reportComments = pgTable('report_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  isOfficial: boolean('is_official').default(false),
  parentId: uuid('parent_id').references(() => reportComments.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Report votes table
export const reportVotes = pgTable('report_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  voteType: varchar('vote_type', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow()
});

// News articles table
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
  tags: jsonb('tags').default('[]'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Forum categories table
export const forumCategories = pgTable('forum_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

// Forum posts table
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
  tags: jsonb('tags').default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Forum comments table
export const forumComments = pgTable('forum_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => forumPosts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  content: text('content').notNull(),
  parentId: uuid('parent_id').references(() => forumComments.id),
  likeCount: integer('like_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  relatedId: uuid('related_id'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

// Device tokens table for push notifications
export const deviceTokens = pgTable('device_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  platform: varchar('platform', { length: 20 }),
  deviceInfo: jsonb('device_info'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Offline sync queue table
export const offlineSyncQueue = pgTable('offline_sync_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityData: jsonb('entity_data').notNull(),
  action: varchar('action', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  syncedAt: timestamp('synced_at'),
  syncStatus: varchar('sync_status', { length: 20 }).default('pending')
});

// System settings table
export const systemSettings = pgTable('system_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  isPublic: boolean('is_public').default(false),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow()
});
