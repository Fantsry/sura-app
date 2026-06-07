import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../config/api';

const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

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

export async function getToken(): Promise<string | null> {
  return Storage.getItem(TOKEN_KEY);
}

export async function setAuth(token: string, user: AuthUser) {
  await Storage.setItem(TOKEN_KEY, token);
  await Storage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  await Storage.removeItem(TOKEN_KEY);
  await Storage.removeItem(USER_KEY);
}

export async function getStoredUser(): Promise<AuthUser | null> {
  const raw = await Storage.getItem(USER_KEY);
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
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Permintaan gagal');
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

  me: () => apiRequest<AuthUser>('/auth/me'),

  getCategories: () =>
    apiRequest<Array<{ id: string; name: string; color: string; icon: string }>>('/categories'),

  getReports: (limit = 20) => apiRequest<Report[]>(`/reports?limit=${limit}`),

  getMyReports: (limit = 50) => apiRequest<Report[]>(`/reports/my?limit=${limit}`),

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
        address: string;
      }>
    >('/reports/map'),

  getReport: (id: string) => apiRequest<Report>(`/reports/${id}`),

  createReport: (data: {
    title: string;
    description: string;
    categorySlug?: string;
    latitude: number;
    longitude: number;
    address?: string;
    isAnonymous?: boolean;
  }) =>
    apiRequest<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPublicStats: () => apiRequest<Record<string, unknown>>('/statistics/public'),

  getNews: () =>
    apiRequest<
      Array<{
        id: string;
        title: string;
        excerpt: string;
        category: string;
        imageUrl: string;
        publishedAt: string;
      }>
    >('/news'),

  createNews: (data: {
    title: string;
    content: string;
    excerpt: string;
    categoryId?: string;
    tags?: string;
    isFeatured?: boolean;
    imageUrl?: string;
  }) =>
    apiRequest<{ id: string }>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getForumPosts: () =>
    apiRequest<
      Array<{
        id: string;
        title: string;
        content: string;
        likeCount: number;
        commentCount: number;
        createdAt: string;
        author: { fullName: string };
        category: { name: string; color: string };
      }>
    >('/forum/posts'),

  admin: {
    dashboard: () =>
      apiRequest<{ stats: Record<string, number>; pendingReports: Report[] }>('/admin/dashboard'),
    updateReportStatus: (id: string, status: string, notes?: string) =>
      apiRequest<Report>(`/admin/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
  },
};

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  address?: string;
}> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Izin lokasi diperlukan untuk membuat laporan');
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = pos.coords;
  let address: string | undefined;

  try {
    const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (geo) {
      address = [geo.street, geo.district, geo.city, geo.region]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  return { latitude, longitude, address };
}
