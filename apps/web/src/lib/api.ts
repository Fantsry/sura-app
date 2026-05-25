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
  category: { id: string; name: string; color: string; icon?: string } | null;
  author: { id: string; username: string; fullName: string; avatarUrl?: string } | null;
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

  getCategories: () =>
    apiRequest<Array<{ id: string; name: string; color: string; icon: string }>>('/categories'),

  getReports: (params?: { limit?: number; mine?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.mine) q.set('mine', 'true');
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
  }) =>
    apiRequest<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPublicStats: () => apiRequest<Record<string, unknown>>('/statistics/public'),

  admin: {
    dashboard: () => apiRequest<{ stats: Record<string, number>; pendingReports: Report[] }>('/admin/dashboard'),
    reports: (status?: string) =>
      apiRequest<Report[]>(`/admin/reports${status ? `?status=${status}` : ''}`),
    updateReportStatus: (id: string, status: string, notes?: string) =>
      apiRequest<Report>(`/admin/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    users: () => apiRequest<AuthUser[]>('/admin/users'),
    statistics: () => apiRequest<Record<string, unknown>>('/admin/statistics'),
  },
};

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
