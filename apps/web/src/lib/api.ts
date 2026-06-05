const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export type AuthUser = {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  points?: number;
  isVerified?: boolean;
  isActive?: boolean;
  phoneNumber?: string | null;
  createdAt?: string;
  lastLogin?: string | null;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  city: string | null;
  province: string | null;
  imageUrls: string[];
  isAnonymous: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  category: { id: string; name: string; color: string; icon?: string } | null;
  author: { id: string; username: string; fullName: string; avatarUrl?: string } | null;
};

export type ReportComment = {
  id: string;
  content: string;
  isOfficial: boolean;
  parentId: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string | null;
    role: string;
  } | null;
};

export type NewsArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  viewCount: number;
  tags: string[];
  publishedAt: string;
  author: string;
  authorAvatar?: string | null;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  author: { id: string; username: string; fullName: string; avatarUrl?: string | null } | null;
  category: { id: string; name: string; color: string } | null;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId: string | null;
  isRead: boolean;
  createdAt: string;
};

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'Permintaan gagal');
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  login: (identifier: string, password: string) =>
    apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
  }) =>
    apiRequest<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiRequest<AuthUser>('/auth/me'),

  updateProfile: (data: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string | null;
  }) =>
    apiRequest<AuthUser>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getCategories: () =>
    apiRequest<Array<{ id: string; name: string; color: string; icon: string }>>('/categories'),

  getReports: (params?: { limit?: number; mine?: boolean; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.mine) q.set('mine', 'true');
    if (params?.status) q.set('status', params.status);
    return apiRequest<Report[]>(`/reports?${q}`);
  },

  getMyReports: (limit = 50) =>
    apiRequest<Report[]>(`/reports/my?limit=${limit}`),

  getMapReports: () =>
    apiRequest<
      Array<{
        id: string;
        title: string;
        latitude: number;
        longitude: number;
        category: string;
        categoryColor: string;
        status: string;
        priority: string;
        address: string;
      }>
    >('/reports/map'),

  getReport: (id: string) => apiRequest<Report>(`/reports/${id}`),

  getReportComments: (id: string) =>
    apiRequest<ReportComment[]>(`/reports/${id}/comments`),

  postReportComment: (id: string, content: string, parentId?: string) =>
    apiRequest<ReportComment>(`/reports/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    }),

  likeReport: (id: string) =>
    apiRequest<{ likeCount: number }>(`/reports/${id}/like`, {
      method: 'POST',
    }),

  createReport: (data: {
    title: string;
    description: string;
    categorySlug?: string;
    categoryId?: string;
    latitude: number;
    longitude: number;
    address?: string;
    imageUrls?: string[];
    isAnonymous?: boolean;
    priority?: string;
  }) =>
    apiRequest<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Upload image file
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<{ url: string; fileName: string; size: number; type: string }>(
      '/upload/image',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  // Upload multiple images
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return apiRequest<{
      files: Array<{ url: string; fileName: string; size: number; type: string }>;
      count: number;
    }>('/upload/images', {
      method: 'POST',
      body: formData,
    });
  },

  // News
  getNews: (params?: { limit?: number; featured?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.featured) q.set('featured', 'true');
    return apiRequest<NewsArticle[]>(`/news?${q}`);
  },
  getNewsById: (id: string) => apiRequest<NewsArticle>(`/news/${id}`),
  createNews: (data: {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    imageUrl?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    tags?: string[];
  }) =>
    apiRequest<NewsArticle>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Admin News Management
  getAllNewsAdmin: (limit = 50) =>
    apiRequest<NewsArticle[]>(`/news/admin/all?limit=${limit}`),
  updateNews: (id: string, data: {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    imageUrl?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    tags?: string[];
  }) =>
    apiRequest<NewsArticle>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteNews: (id: string) =>
    apiRequest<{ message: string }>(`/news/${id}`, {
      method: 'DELETE',
    }),

  // Forum
  getForumCategories: () =>
    apiRequest<Array<{ id: string; name: string; color: string; icon: string }>>(
      '/forum/categories'
    ),
  getForumPosts: (params?: { limit?: number; categoryId?: string }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.categoryId) q.set('categoryId', params.categoryId);
    return apiRequest<ForumPost[]>(`/forum/posts?${q}`);
  },
  getForumPost: (id: string) =>
    apiRequest<ForumPost & { comments: Array<{ id: string; content: string; createdAt: string; author: { id: string; fullName: string; avatarUrl?: string | null } | null }> }>(
      `/forum/posts/${id}`
    ),
  createForumPost: (data: {
    title: string;
    content: string;
    categoryId?: string;
    tags?: string[];
  }) =>
    apiRequest<ForumPost>('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  likeForumPost: (id: string) =>
    apiRequest<{ likeCount: number }>(`/forum/posts/${id}/like`, {
      method: 'POST',
    }),
  deleteForumPost: (id: string) =>
    apiRequest<{ message: string }>(`/forum/posts/${id}`, {
      method: 'DELETE',
    }),
  createForumComment: (id: string, content: string, parentId?: string) =>
    apiRequest<unknown>(`/forum/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    }),

  getPublicStats: () =>
    apiRequest<{
      totalReports: number;
      verifiedReports: number;
      resolvedReports: number;
      pendingReports: number;
      resolutionRate: number;
      byCategory: Array<{ name: string | null; color: string | null; count: number }>;
      monthly: Array<{ month: string; count: number }>;
      mapPoints: Array<{ latitude: number | null; longitude: number | null; status: string }>;
    }>('/statistics/public'),

  admin: {
    dashboard: () => apiRequest<{ stats: Record<string, number>; pendingReports: Report[] }>('/admin/dashboard'),
    reports: (status?: string) =>
      apiRequest<Report[]>(`/admin/reports${status ? `?status=${status}` : ''}`),
    updateReportStatus: (id: string, status: string, notes?: string) =>
      apiRequest<Report>(`/admin/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    users: (role?: string) =>
      apiRequest<AuthUser[]>(`/admin/users${role ? `?role=${role}` : ''}`),
    updateUser: (
      id: string,
      data: { role?: string; isActive?: boolean; isVerified?: boolean }
    ) =>
      apiRequest<AuthUser>(`/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    statistics: () =>
      apiRequest<{
        byStatus: Array<{ status: string; count: number }>;
        byCategory: Array<{ category: string | null; color: string | null; count: number }>;
        monthly: unknown;
      }>('/admin/statistics'),
  },

  // Notifications
  getNotifications: (limit = 50) =>
    apiRequest<{ notifications: Notification[]; unreadCount: number }>(
      `/notifications?limit=${limit}`
    ),
  markNotificationRead: (id: string) =>
    apiRequest<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () =>
    apiRequest<{ message: string }>('/notifications/read-all', {
      method: 'POST',
    }),
};

export const STATUS_META: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  pending: { label: 'Menunggu', bg: 'bg-error-container', color: 'text-error', dot: 'bg-error' },
  verified: {
    label: 'Terverifikasi',
    bg: 'bg-secondary-container',
    color: 'text-on-secondary-container',
    dot: 'bg-primary',
  },
  in_progress: {
    label: 'Diproses',
    bg: 'bg-secondary-container',
    color: 'text-on-secondary-container',
    dot: 'bg-primary',
  },
  resolved: {
    label: 'Selesai',
    bg: 'bg-tertiary-fixed',
    color: 'text-on-tertiary-fixed',
    dot: 'bg-outline',
  },
  rejected: { label: 'Ditolak', bg: 'bg-error-container', color: 'text-error', dot: 'bg-error' },
};

export function formatRelative(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff)) return '';
  const sec = Math.round(diff / 1000);
  if (sec < 60) return 'Baru saja';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} hari lalu`;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  address?: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolokasi tidak didukung di perangkat ini'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let address: string | undefined;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'id' } }
          );
          if (res.ok) {
            const data = await res.json();
            address = data.display_name as string;
          }
        } catch {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        resolve({ latitude, longitude, address });
      },
      (err) => reject(new Error(err.message || 'Gagal mendapatkan lokasi')),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}
