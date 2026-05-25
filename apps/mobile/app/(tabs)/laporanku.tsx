import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraButton } from '@/components/sura/SuraButton';
import { ReportCard } from '@/components/sura/ReportCard';
import { api, type Report } from '@/src/lib/api';

export default function LaporankuScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <SuraText variant="h2">Laporanku</SuraText>
          <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
            Riwayat laporan Anda
          </SuraText>
        </View>
        <SuraButton title="Baru" onPress={() => router.push('/(tabs)/lapor')} style={styles.btnSmall} />
      </View>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        renderItem={({ item }) => (
          <ReportCard report={item} onPress={() => router.push(`/report/${item.id}`)} />
        )}
        ListEmptyComponent={
          <SuraText variant="bodyMd" color={Colors.outline} style={{ textAlign: 'center', marginTop: 32 }}>
            Belum ada laporan. Buat laporan pertama Anda.
          </SuraText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.gutter,
    paddingBottom: 0,
  },
  btnSmall: { height: 40, paddingHorizontal: 16 },
  list: { padding: Spacing.gutter },
});
