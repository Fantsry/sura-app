import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, StatusMeta } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { ReportCard } from '@/components/sura/ReportCard';
import { api, type Report } from '@/src/lib/api';

const FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'verified', label: 'Terverifikasi' },
  { key: 'in_progress', label: 'Diproses' },
  { key: 'resolved', label: 'Selesai' },
];

export default function LaporankuScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    const data = await api.getMyReports();
    setReports(data);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load().catch(() => {});
    setRefreshing(false);
  };

  const filtered = filter === 'all' ? reports : reports.filter((r) => r.status === filter);
  const counts = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <SuraText variant="h2">Laporanku</SuraText>
                <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
                  Riwayat laporan Anda
                </SuraText>
              </View>
              <Pressable
                style={styles.newBtn}
                onPress={() => router.push('/(tabs)/lapor')}
              >
                <MaterialIcons name="add" size={18} color={Colors.onPrimary} />
                <SuraText variant="button" color={Colors.onPrimary}>
                  Baru
                </SuraText>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <StatBox label="TOTAL" value={counts.total} color={Colors.primary} />
              <StatBox
                label="MENUNGGU"
                value={counts.pending}
                color={Colors.error}
              />
              <StatBox
                label="SELESAI"
                value={counts.resolved}
                color={Colors.success}
              />
            </View>

            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={(item) => item.key}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
              renderItem={({ item }) => {
                const active = filter === item.key;
                const meta = StatusMeta[item.key];
                return (
                  <Pressable
                    onPress={() => setFilter(item.key)}
                    style={[
                      styles.filterChip,
                      active && {
                        backgroundColor: meta?.color ?? Colors.primary,
                        borderColor: meta?.color ?? Colors.primary,
                      },
                    ]}
                  >
                    <SuraText
                      variant="button"
                      color={active ? Colors.onPrimary : Colors.onSurface}
                    >
                      {item.label}
                    </SuraText>
                  </Pressable>
                );
              }}
            />
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <ReportCard report={item} onPress={() => router.push(`/report/${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons
              name="inbox"
              size={48}
              color={Colors.outlineVariant}
            />
            <SuraText
              variant="bodyMd"
              color={Colors.outline}
              style={{ marginTop: Spacing.sm }}
            >
              Belum ada laporan untuk filter ini
            </SuraText>
          </View>
        }
      />
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
      <SuraText variant="labelBold" color={Colors.outline}>
        {label}
      </SuraText>
      <SuraText variant="h2" color={color}>
        {value}
      </SuraText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.gutter, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    height: 40,
    borderRadius: Radius.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderLeftWidth: 4,
  },
  filterRow: {
    gap: 8,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 36,
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  empty: { alignItems: 'center', padding: Spacing.xl },
});
