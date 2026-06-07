import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { useAuth } from '@/src/context/AuthContext';
import { api, type Report } from '@/src/lib/api';

export default function AdminDashboardScreen() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await api.admin.dashboard();
    setStats(data.stats);
    setPending(data.pendingReports);
  }, []);

  useEffect(() => {
    if (isAdmin) load().catch(() => {});
  }, [isAdmin, load]);

  if (!isAdmin) return <Redirect href="/(tabs)/profil" />;

  const updateStatus = async (id: string, status: string) => {
    const actionMap: Record<string, string> = {
      verified: 'Memverifikasi Laporan',
      rejected: 'Menolak Laporan',
      in_progress: 'Menindaklanjuti Laporan',
      resolved: 'Menyelesaikan Laporan',
    };
    Alert.alert(
      'Konfirmasi Tindakan',
      `Apakah Anda yakin ingin: ${actionMap[status] ?? status}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya, Lanjutkan', 
          onPress: async () => {
            try {
              await api.admin.updateReportStatus(id, status);
              await load();
            } catch (e) {
              Alert.alert('Gagal', e instanceof Error ? e.message : 'Error');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatBox label="Total" value={stats.totalReports} />
        <StatBox label="Pending" value={stats.pendingReports} highlight />
        <StatBox label="Selesai" value={stats.resolvedReports} />
      </View>
      <SuraText variant="h3" style={styles.sectionTitle}>
        Perlu Moderasi
      </SuraText>
      <FlatList
        data={pending}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <SuraCard style={styles.row}>
            <SuraText variant="bodyMd" style={{ fontFamily: 'Inter_700Bold' }}>
              {item.title}
            </SuraText>
            <SuraText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={2}>
              {item.description}
            </SuraText>
            <View style={styles.actions}>
              <Pressable onPress={() => updateStatus(item.id, 'verified')}>
                <MaterialIcons name="check-circle" size={36} color={Colors.primary} />
              </Pressable>
              <Pressable onPress={() => updateStatus(item.id, 'rejected')}>
                <MaterialIcons name="cancel" size={36} color={Colors.error} />
              </Pressable>
            </View>
          </SuraCard>
        )}
        ListEmptyComponent={
          <SuraText color={Colors.outline} style={{ textAlign: 'center', marginTop: 24 }}>
            Tidak ada laporan pending
          </SuraText>
        }
        contentContainerStyle={{ padding: Spacing.gutter }}
      />
    </View>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: number;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.statBox, highlight && { borderColor: Colors.secondary }]}>
      <SuraText variant="labelBold" color={Colors.outline}>
        {label}
      </SuraText>
      <SuraText variant="h2" color={highlight ? Colors.secondary : Colors.primary}>
        {value ?? 0}
      </SuraText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsRow: { flexDirection: 'row', padding: Spacing.gutter, gap: Spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  sectionTitle: { paddingHorizontal: Spacing.gutter, marginBottom: Spacing.sm },
  row: { marginBottom: Spacing.md },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md, marginTop: Spacing.sm },
});
