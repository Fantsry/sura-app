import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { ReportCard } from '@/components/sura/ReportCard';
import { api, type Report } from '@/src/lib/api';
import { useAuth } from '@/src/context/AuthContext';

type MapPoint = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  category: string;
  categoryColor?: string;
  status: string;
};

const JAKARTA = {
  latitude: -6.2,
  longitude: 106.816666,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function BerandaScreen() {
  const { user } = useAuth();
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

  const HeaderBlock = (
    <>
      {/* Top hero: greeting + quick action */}
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
            Halo, {user?.fullName?.split(' ')[0] ?? 'Warga'} 👋
          </SuraText>
          <SuraText variant="h2" color={Colors.primary}>
            Suara Rakyat
          </SuraText>
        </View>
        <View style={styles.heroBadge}>
          <SuraText variant="labelBold" color={Colors.onPrimary}>
            {user?.role === 'admin' ? 'ADMIN' : 'WARGA'}
          </SuraText>
        </View>
      </View>

      {/* Map preview */}
      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={JAKARTA}
        >
          {mapPoints.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.title}
              description={p.category}
              pinColor={p.categoryColor ?? Colors.primary}
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
            <SuraText variant="bodySm">Pencurian / Keamanan</SuraText>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: Colors.secondary }]} />
            <SuraText variant="bodySm">Event / Kegiatan</SuraText>
          </View>
        </View>
      </View>

      {/* Quick actions row */}
      <View style={styles.actions}>
        <QuickAction
          icon="add-circle"
          label="Lapor"
          color={Colors.primary}
          onPress={() => router.push('/(tabs)/lapor')}
        />
        <QuickAction
          icon="forum"
          label="Komunitas"
          color={Colors.secondary}
          onPress={() => router.push('/(tabs)/komunitas')}
        />
        <QuickAction
          icon="newspaper"
          label="Berita"
          color={Colors.tertiary}
          onPress={() => router.push('/berita')}
        />
        <QuickAction
          icon="bar-chart"
          label="Statistik"
          color={Colors.error}
          onPress={() => router.push('/statistik')}
        />
      </View>

      <View style={styles.feedHeader}>
        <View>
          <SuraText variant="h3" color={Colors.primary}>
            Aduan Terbaru
          </SuraText>
          <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
            Laporan masuk real-time
          </SuraText>
        </View>
        <Pressable onPress={() => router.push('/(tabs)/laporanku')}>
          <MaterialIcons name="filter-list" size={24} color={Colors.outline} />
        </Pressable>
      </View>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={HeaderBlock}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
      renderItem={({ item }) => (
        <ReportCard
          report={item}
          onPress={() => router.push(`/report/${item.id}`)}
        />
      )}
      ListEmptyComponent={
        <SuraText
          variant="bodySm"
          color={Colors.outline}
          style={{ textAlign: 'center', marginTop: 16 }}
        >
          Belum ada laporan terverifikasi
        </SuraText>
      }
    />
  );
}

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: `${color}1A` }]}>
        <MaterialIcons name={icon} size={26} color={color} />
      </View>
      <SuraText variant="labelBold" color={Colors.onSurface}>
        {label}
      </SuraText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xl },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  heroBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  mapWrap: {
    height: 240,
    marginHorizontal: Spacing.gutter,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  map: { flex: 1 },
  legend: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  action: { flex: 1, alignItems: 'center' },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm,
  },
});
