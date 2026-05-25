import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, StatusMeta } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { SuraButton } from '@/components/sura/SuraButton';
import { api, type Report } from '@/src/lib/api';

const TIMELINE: Array<{ key: string; label: string }> = [
  { key: 'pending', label: 'DILAPORKAN' },
  { key: 'verified', label: 'DIVERIFIKASI' },
  { key: 'in_progress', label: 'DITINDAKLANJUTI' },
  { key: 'resolved', label: 'SELESAI' },
];

const ORDER: Record<string, number> = {
  pending: 0,
  verified: 1,
  in_progress: 2,
  resolved: 3,
};

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getReport(id)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.center}>
        <SuraText>Laporan tidak ditemukan</SuraText>
      </View>
    );
  }

  const status = StatusMeta[report.status] ?? { label: report.status, color: Colors.outline, bg: Colors.surfaceContainer };
  const reachedIndex = ORDER[report.status] ?? 0;

  const openInMaps = () => {
    if (!report.latitude || !report.longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={[styles.statusChip, { backgroundColor: status.bg }]}>
          <SuraText variant="labelBold" color={status.color}>
            {status.label.toUpperCase()}
          </SuraText>
        </View>
        <SuraText variant="labelBold" color={Colors.outline}>
          ID: #{report.id.slice(0, 8)}
        </SuraText>
      </View>

      <SuraText variant="h1" style={{ marginTop: Spacing.sm }}>
        {report.title}
      </SuraText>
      <SuraText
        variant="bodyMd"
        color={Colors.onSurfaceVariant}
        style={{ marginTop: Spacing.sm }}
      >
        {report.description}
      </SuraText>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <MaterialIcons name="calendar-today" size={18} color={Colors.primary} />
          <View>
            <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
              DILAPORKAN
            </SuraText>
            <SuraText variant="bodySm">
              {new Date(report.createdAt).toLocaleString('id-ID')}
            </SuraText>
          </View>
        </View>
        <View style={styles.metaItem}>
          <MaterialIcons name="category" size={18} color={Colors.primary} />
          <View>
            <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
              KATEGORI
            </SuraText>
            <SuraText variant="bodySm">{report.category?.name ?? 'Umum'}</SuraText>
          </View>
        </View>
      </View>

      {/* Map */}
      {report.latitude && report.longitude ? (
        <SuraCard style={{ padding: 0, overflow: 'hidden' }}>
          <View style={styles.mapBox}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: report.latitude,
                longitude: report.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                }}
                pinColor={Colors.error}
              />
            </MapView>
          </View>
          <View style={{ padding: Spacing.md }}>
            <View style={styles.locRow}>
              <MaterialIcons name="location-on" size={18} color={Colors.error} />
              <SuraText variant="bodySm" style={{ flex: 1 }}>
                {report.address ?? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`}
              </SuraText>
            </View>
            <SuraButton
              title="Buka di Maps"
              variant="outline"
              onPress={openInMaps}
              style={{ marginTop: Spacing.sm, height: 40 }}
            />
          </View>
        </SuraCard>
      ) : null}

      {/* Timeline */}
      <SuraCard style={{ marginTop: Spacing.md }}>
        <SuraText variant="h3" style={{ marginBottom: Spacing.md }}>
          Riwayat Status
        </SuraText>
        {TIMELINE.map((step, idx) => {
          const reached = idx <= reachedIndex && report.status !== 'rejected';
          return (
            <View key={step.key} style={styles.timelineRow}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: reached ? Colors.primary : Colors.outlineVariant },
                ]}
              />
              {idx < TIMELINE.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: reached ? Colors.primary : Colors.outlineVariant },
                  ]}
                />
              )}
              <View style={{ flex: 1, paddingBottom: Spacing.md }}>
                <SuraText
                  variant="labelBold"
                  color={reached ? Colors.primary : Colors.outline}
                >
                  {step.label}
                </SuraText>
                {idx === reachedIndex && (
                  <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
                    {new Date(report.updatedAt).toLocaleString('id-ID')}
                  </SuraText>
                )}
              </View>
            </View>
          );
        })}
      </SuraCard>

      {/* Author */}
      {report.author && !report.isAnonymous ? (
        <SuraCard style={{ marginTop: Spacing.md }}>
          <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
            DILAPORKAN OLEH
          </SuraText>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <SuraText variant="h3" color={Colors.onPrimary}>
                {report.author.fullName?.charAt(0)?.toUpperCase() ?? '?'}
              </SuraText>
            </View>
            <View>
              <SuraText variant="bodyMd">{report.author.fullName}</SuraText>
              <SuraText variant="bodySm" color={Colors.outline}>
                @{report.author.username}
              </SuraText>
            </View>
          </View>
        </SuraCard>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.gutter, paddingBottom: Spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  mapBox: { height: 180 },
  map: { flex: 1 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timelineRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingLeft: 4,
    position: 'relative',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 10,
    top: 18,
    bottom: 0,
    width: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
