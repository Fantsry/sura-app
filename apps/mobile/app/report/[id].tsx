import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { api, type Report } from '@/src/lib/api';

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.status, { backgroundColor: `${report.category?.color ?? Colors.primary}22` }]}>
        <SuraText variant="labelBold" color={report.category?.color ?? Colors.primary}>
          {report.category?.name} · {report.status}
        </SuraText>
      </View>
      <SuraText variant="h1" style={{ marginVertical: Spacing.md }}>
        {report.title}
      </SuraText>
      <SuraCard>
        <SuraText variant="bodyMd">{report.description}</SuraText>
      </SuraCard>
      {report.address ? (
        <SuraCard style={{ marginTop: Spacing.md }}>
          <SuraText variant="labelBold">Lokasi</SuraText>
          <SuraText variant="bodyMd" color={Colors.onSurfaceVariant}>
            {report.address}
          </SuraText>
          {report.latitude && report.longitude ? (
            <SuraText variant="bodySm" color={Colors.outline} style={{ marginTop: 4 }}>
              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </SuraText>
          ) : null}
        </SuraCard>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.gutter },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  status: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
});
