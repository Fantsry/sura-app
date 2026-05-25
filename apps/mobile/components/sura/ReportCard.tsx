import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from './SuraText';
import type { Report } from '@/src/lib/api';

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  verified: 'Terverifikasi',
  in_progress: 'Diproses',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};

export function ReportCard({
  report,
  onPress,
}: {
  report: Report;
  onPress?: () => void;
}) {
  const catColor = report.category?.color ?? Colors.primary;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.95 }]}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: `${catColor}22` }]}>
            <SuraText variant="labelBold" color={catColor}>
              {report.category?.name ?? 'Umum'}
            </SuraText>
          </View>
          <SuraText variant="bodySm" color={Colors.outline}>
            {statusLabel[report.status] ?? report.status}
          </SuraText>
        </View>
        <SuraText variant="h3" style={styles.title}>
          {report.title}
        </SuraText>
        <SuraText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={2}>
          {report.description}
        </SuraText>
        {report.address ? (
          <View style={styles.loc}>
            <MaterialIcons name="location-on" size={14} color={Colors.outline} />
            <SuraText variant="bodySm" color={Colors.outline} numberOfLines={1} style={{ flex: 1 }}>
              {report.address}
            </SuraText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  title: { marginBottom: 4 },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
});
