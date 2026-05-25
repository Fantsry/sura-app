import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { ReportCard } from '@/components/sura/ReportCard';
import { api, type Report } from '@/src/lib/api';

type MapPoint = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
};

const JAKARTA = { latitude: -6.2, longitude: 106.816666, latitudeDelta: 0.08, longitudeDelta: 0.08 };

export default function BerandaScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [list, map] = await Promise.all([
      api.getReports(15).catch(() => []),
      api.getMapReports().catch(() => []),
    ]);
    setReports(list);
    setMapPoints(map);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <MapView style={styles.map} provider={PROVIDER_DEFAULT} initialRegion={JAKARTA}>
          {mapPoints.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.title}
              description={p.category}
            />
          ))}
        </MapView>
        <View style={styles.legend}>
          <SuraText variant="labelBold" color={Colors.onSurface}>
            Legenda Laporan
          </SuraText>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: Colors.error }]} />
            <SuraText variant="bodySm">Bencana / Urgent</SuraText>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
            <SuraText variant="bodySm">Keamanan</SuraText>
          </View>
        </View>
      </View>

      <View style={styles.feed}>
        <SuraText variant="h3" color={Colors.primary}>
          Aduan Terbaru
        </SuraText>
        <SuraText variant="bodySm" color={Colors.onSurfaceVariant} style={{ marginBottom: Spacing.md }}>
          Laporan masuk real-time
        </SuraText>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          renderItem={({ item }) => (
            <ReportCard report={item} onPress={() => router.push(`/report/${item.id}`)} />
          )}
          ListEmptyComponent={
            <SuraText variant="bodySm" color={Colors.outline}>
              Belum ada laporan terverifikasi
            </SuraText>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapWrap: { height: 280, position: 'relative' },
  map: { flex: 1 },
  legend: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  feed: { flex: 1, padding: Spacing.gutter, paddingTop: Spacing.md },
});
