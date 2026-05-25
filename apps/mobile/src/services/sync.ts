import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/api';
import { dbHelpers } from '../lib/database';

export interface SyncQueueItem {
  id: string;
  userId?: string;
  entityType: string;
  entityData: Record<string, unknown>;
  action: 'create' | 'update' | 'delete';
  createdAt: string;
  syncedAt?: string;
  syncStatus: 'pending' | 'synced' | 'failed';
}

export class SyncService {
  private apiBase: string;

  constructor() {
    this.apiBase = API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    return SecureStore.getItemAsync('auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${this.apiBase}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async syncToServer(): Promise<{ success: number; failed: number }> {
    const queueItems = (await dbHelpers.getSyncQueue()) as SyncQueueItem[];
    let successCount = 0;
    let failedCount = 0;

    for (const item of queueItems) {
      try {
        await this.syncItem(item);
        await dbHelpers.markSyncItemAsSynced(item.id);
        successCount++;
      } catch {
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    const { entityType, entityData, action } = item;
    let endpoint = '';
    let method = 'POST';

    if (entityType === 'report') {
      endpoint = '/reports';
      if (action === 'update') {
        endpoint = `/reports/${entityData.id}`;
        method = 'PUT';
      } else if (action === 'delete') {
        endpoint = `/reports/${entityData.id}`;
        method = 'DELETE';
      }
    } else {
      throw new Error(`Unknown entity type: ${entityType}`);
    }

    await this.makeRequest(endpoint, {
      method,
      body: JSON.stringify(entityData),
    });
  }

  async syncFromServer(): Promise<void> {
    const categories = await this.makeRequest('/categories');
    await dbHelpers.syncCategories(categories);
    const reports = await this.makeRequest('/reports?limit=50');
    for (const report of reports as Array<Record<string, unknown>>) {
      await dbHelpers.createReport({ ...report, syncStatus: 'synced' }).catch(() => {});
    }
  }

  async checkConnectivity(): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiBase.replace('/api', '')}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  async clearAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

export const syncService = new SyncService();
