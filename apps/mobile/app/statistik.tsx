import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { api } from '@/src/lib/api';

export default function StatistikScreen() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    api.getPublicStats().then((d) => setStats(d as Record<string, number>)).catch(() => {});
  }, []);

  const items = [
    { label: 'Total Laporan', value: stats.totalReports },
    { label: 'Terverifikasi', value: stats.verifiedReports },
    { label: 'Selesai', value: stats.resolvedReports },
    { label: 'Pending', value: stats.pendingReports },
    { label: 'Tingkat Penyelesaian', value: stats.resolutionRate, suffix: '%' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SuraText variant="h2" color={Colors.primary} style={{ marginBottom: Spacing.lg }}>
        Statistik Publik
      </SuraText>
      {items.map((item) => (
        <SuraCard key={item.label} style={styles.card}>
          <SuraText variant="labelBold" color={Colors.outline}>
            {item.label}
          </SuraText>
          <SuraText variant="h1" color={Colors.primary} style={{ marginTop: 4 }}>
            {item.value ?? 0}
            {item.suffix ?? ''}
          </SuraText>
        </SuraCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.gutter },
  card: { marginBottom: Spacing.md },
});
