import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { api } from '@/src/lib/api';

type Stats = {
  totalReports: number;
  verifiedReports: number;
  resolvedReports: number;
  pendingReports: number;
  resolutionRate: number;
  byCategory: Array<{ name: string; color: string; count: number }>;
};

export default function StatistikScreen() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api
      .getPublicStats()
      .then((d) => setStats(d as unknown as Stats))
      .catch(() => {});
  }, []);

  const totalCat =
    stats?.byCategory?.reduce((s, c) => s + Number(c.count ?? 0), 0) ?? 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <SuraText variant="h2" color={Colors.primary}>
          Transparansi Data
        </SuraText>
        <SuraText
          variant="bodyMd"
          color={Colors.onSurfaceVariant}
          style={{ marginTop: 4 }}
        >
          Pantau efektivitas layanan dan keamanan lingkungan secara real-time.
        </SuraText>
      </View>

      <View style={styles.heroRow}>
        <HeroBox
          label="Total Laporan"
          value={stats?.totalReports ?? 0}
          icon="description"
        />
        <HeroBox
          label="Terverifikasi"
          value={stats?.verifiedReports ?? 0}
          icon="verified"
          color={Colors.primary}
        />
      </View>

      <View style={styles.heroRow}>
        <HeroBox
          label="Selesai"
          value={stats?.resolvedReports ?? 0}
          icon="check-circle"
          color={Colors.success}
        />
        <HeroBox
          label="Menunggu"
          value={stats?.pendingReports ?? 0}
          icon="hourglass-empty"
          color={Colors.error}
        />
      </View>

      {/* Resolution rate banner */}
      <View style={styles.banner}>
        <View style={{ flex: 1 }}>
          <SuraText variant="labelBold" color={Colors.onPrimaryContainer}>
            TINGKAT PENYELESAIAN
          </SuraText>
          <SuraText
            variant="h1"
            color={Colors.onPrimary}
            style={{ marginTop: 4 }}
          >
            {stats?.resolutionRate ?? 0}%
          </SuraText>
          <View style={styles.bannerTrack}>
            <View
              style={[
                styles.bannerFill,
                { width: `${stats?.resolutionRate ?? 0}%` },
              ]}
            />
          </View>
        </View>
        <MaterialIcons
          name="trending-up"
          size={48}
          color={Colors.onPrimary}
          style={{ opacity: 0.3 }}
        />
      </View>

      {/* Category breakdown */}
      <SuraText
        variant="h3"
        color={Colors.onSurface}
        style={{
          paddingHorizontal: Spacing.gutter,
          marginTop: Spacing.lg,
          marginBottom: Spacing.sm,
        }}
      >
        Kategori Terbanyak
      </SuraText>
      <View style={styles.catCard}>
        {(stats?.byCategory ?? []).slice(0, 6).map((c) => {
          const pct = totalCat > 0 ? Math.round((Number(c.count) / totalCat) * 100) : 0;
          const color = c.color || Colors.primary;
          return (
            <View key={c.name ?? 'unknown'} style={{ marginBottom: Spacing.md }}>
              <View style={styles.catRow}>
                <View style={styles.catLabel}>
                  <View style={[styles.catDot, { backgroundColor: color }]} />
                  <SuraText variant="bodyMd">{c.name ?? 'Lainnya'}</SuraText>
                </View>
                <SuraText variant="button" color={Colors.onSurface}>
                  {pct}%
                </SuraText>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${pct}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
          );
        })}
        {(!stats || stats.byCategory.length === 0) && (
          <SuraText color={Colors.outline} style={{ textAlign: 'center' }}>
            Belum ada data kategori
          </SuraText>
        )}
      </View>
    </ScrollView>
  );
}

function HeroBox({
  label,
  value,
  icon,
  color = Colors.primary,
}: {
  label: string;
  value: number;
  icon: keyof typeof MaterialIcons.glyphMap;
  color?: string;
}) {
  return (
    <View style={styles.heroBox}>
      <View style={styles.heroHead}>
        <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
          {label.toUpperCase()}
        </SuraText>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <SuraText variant="h1" color={color} style={{ marginTop: 4 }}>
        {value}
      </SuraText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xl },
  header: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.gutter,
    marginBottom: Spacing.sm,
  },
  heroBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
  },
  heroHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.gutter,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
  },
  bannerTrack: {
    height: 8,
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  bannerFill: { height: '100%', backgroundColor: Colors.onPrimary },
  catCard: {
    marginHorizontal: Spacing.gutter,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catDot: { width: 12, height: 12, borderRadius: 6 },
  barTrack: {
    height: 8,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.full,
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
});
