import type { users } from '../db/schema';

type DbUser = typeof users.$inferSelect;

export function serializeUser(user: DbUser, includePrivate = false) {
  const base = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    points: user.points,
    isVerified: user.isVerified,
  };

  if (!includePrivate) return base;

  return {
    ...base,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
}

export function serializeReport(
  report: Record<string, unknown>,
  options?: { hideAuthor?: boolean }
) {
  const author = report.author as Record<string, unknown> | undefined;
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    status: report.status,
    priority: report.priority,
    latitude: report.latitude ? Number(report.latitude) : null,
    longitude: report.longitude ? Number(report.longitude) : null,
    address: report.address,
    city: report.city,
    province: report.province,
    imageUrls: report.imageUrls ?? [],
    isAnonymous: report.isAnonymous,
    viewCount: report.viewCount,
    likeCount: report.likeCount,
    commentCount: report.commentCount,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    resolvedAt: report.resolvedAt,
    category: report.category ?? null,
    author:
      report.isAnonymous || options?.hideAuthor
        ? null
        : author
          ? {
              id: author.id,
              username: author.username,
              fullName: author.fullName,
              avatarUrl: author.avatarUrl,
            }
          : null,
  };
}
