import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { api } from '@/src/lib/api';

export default function BeritaScreen() {
  const [articles, setArticles] = useState<
    Array<{ id: string; title: string; excerpt: string; category: string }>
  >([]);

  useEffect(() => {
    api.getNews().then(setArticles).catch(() => {});
  }, []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SuraCard style={styles.card}>
          <SuraText variant="labelBold" color={Colors.primary}>
            {item.category}
          </SuraText>
          <SuraText variant="h3" style={{ marginVertical: 6 }}>
            {item.title}
          </SuraText>
          <SuraText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={3}>
            {item.excerpt}
          </SuraText>
        </SuraCard>
      )}
      ListEmptyComponent={
        <SuraText color={Colors.outline} style={{ textAlign: 'center', marginTop: 32 }}>
          Belum ada berita
        </SuraText>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: Spacing.gutter },
  card: { marginBottom: Spacing.md },
});
