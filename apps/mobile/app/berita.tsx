import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { api } from '@/src/lib/api';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
};

const TRENDING = [
  '#PembangunanJalan',
  '#LaporBanjir',
  '#KeamananWarga',
  '#LayananPublik',
];

export default function BeritaScreen() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api
      .getNews()
      .then((data) => setArticles(data as Article[]))
      .catch(() => setArticles([]));
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={rest}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <SuraText variant="h2" color={Colors.primary}>
              Portal Berita
            </SuraText>
            <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
              Ringkasan info terbaru untuk warga
            </SuraText>
          </View>

          {featured ? (
            <View style={styles.feature}>
              {featured.imageUrl ? (
                <Image
                  source={{ uri: featured.imageUrl }}
                  style={styles.featureImg}
                />
              ) : (
                <View style={[styles.featureImg, styles.featureFallback]}>
                  <MaterialIcons name="campaign" size={48} color={Colors.primary} />
                </View>
              )}
              <View style={styles.featureBody}>
                <View style={styles.headlineBadge}>
                  <SuraText variant="labelBold" color={Colors.onPrimary}>
                    BERITA UTAMA
                  </SuraText>
                </View>
                <SuraText
                  variant="h2"
                  color={Colors.onSurface}
                  style={{ marginTop: Spacing.sm }}
                >
                  {featured.title}
                </SuraText>
                <SuraText
                  variant="bodySm"
                  color={Colors.onSurfaceVariant}
                  style={{ marginTop: 4 }}
                  numberOfLines={3}
                >
                  {featured.excerpt}
                </SuraText>
                <View style={styles.featureMeta}>
                  <MaterialIcons
                    name="calendar-today"
                    size={14}
                    color={Colors.outline}
                  />
                  <SuraText variant="bodySm" color={Colors.outline}>
                    {new Date(featured.publishedAt).toLocaleDateString('id-ID')}
                  </SuraText>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.trendingBox}>
            <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
              TOPIK HANGAT
            </SuraText>
            <View style={styles.trendingRow}>
              {TRENDING.map((t) => (
                <Pressable key={t} style={styles.trendingChip}>
                  <SuraText variant="bodySm" color={Colors.primary}>
                    {t}
                  </SuraText>
                </Pressable>
              ))}
            </View>
          </View>

          <SuraText
            variant="h3"
            color={Colors.primary}
            style={{
              paddingHorizontal: Spacing.gutter,
              marginTop: Spacing.lg,
              marginBottom: Spacing.sm,
            }}
          >
            Artikel Terbaru
          </SuraText>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />
          ) : (
            <View style={[styles.cardImg, styles.featureFallback]}>
              <MaterialIcons name="article" size={32} color={Colors.outline} />
            </View>
          )}
          <View style={{ padding: Spacing.md }}>
            <View style={styles.catBadge}>
              <SuraText variant="labelBold" color={Colors.onSecondaryContainer}>
                {item.category}
              </SuraText>
            </View>
            <SuraText
              variant="h3"
              style={{ marginVertical: 6 }}
              numberOfLines={2}
            >
              {item.title}
            </SuraText>
            <SuraText
              variant="bodySm"
              color={Colors.onSurfaceVariant}
              numberOfLines={3}
            >
              {item.excerpt}
            </SuraText>
            <View style={styles.cardFooter}>
              <SuraText variant="bodySm" color={Colors.outline}>
                {new Date(item.publishedAt).toLocaleDateString('id-ID')}
              </SuraText>
              <View style={styles.readMore}>
                <SuraText variant="button" color={Colors.primary}>
                  Baca Selengkapnya
                </SuraText>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color={Colors.primary}
                />
              </View>
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={
        articles.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="article" size={48} color={Colors.outlineVariant} />
            <SuraText color={Colors.outline} style={{ marginTop: 8 }}>
              Belum ada berita yang dipublikasikan
            </SuraText>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: Spacing.xl },
  header: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  feature: {
    marginHorizontal: Spacing.gutter,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  featureImg: { width: '100%', height: 180 },
  featureFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  featureBody: { padding: Spacing.md },
  headlineBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  featureMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.md,
  },
  trendingBox: {
    paddingHorizontal: Spacing.gutter,
    marginTop: Spacing.md,
  },
  trendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  trendingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  card: {
    marginHorizontal: Spacing.gutter,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  cardImg: { width: '100%', height: 140 },
  catBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empty: { alignItems: 'center', padding: Spacing.xl },
});
