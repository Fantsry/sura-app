import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraCard } from '@/components/sura/SuraCard';
import { api } from '@/src/lib/api';

type Post = {
  id: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  author: { fullName: string };
  category: { name: string; color: string };
};

export default function KomunitasScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await api.getForumPosts();
    setPosts(data as Post[]);
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <SuraText variant="h3" color={Colors.onPrimaryContainer}>
          Komunitas Forum
        </SuraText>
        <SuraText variant="bodySm" color={Colors.onSurfaceVariant} style={{ marginTop: 4 }}>
          Diskusi bebas warga — tidak perlu verifikasi admin seperti laporan resmi.
        </SuraText>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load().catch(() => {});
              setRefreshing(false);
            }}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <SuraCard style={styles.card}>
            <View style={[styles.cat, { backgroundColor: `${item.category?.color ?? Colors.primary}22` }]}>
              <SuraText variant="labelBold" color={item.category?.color ?? Colors.primary}>
                {item.category?.name ?? 'Umum'}
              </SuraText>
            </View>
            <SuraText variant="h3" style={{ marginVertical: 6 }}>
              {item.title}
            </SuraText>
            <SuraText variant="bodySm" color={Colors.onSurfaceVariant} numberOfLines={3}>
              {item.content}
            </SuraText>
            <SuraText variant="bodySm" color={Colors.outline} style={{ marginTop: 8 }}>
              {item.author?.fullName} · {item.commentCount} komentar
            </SuraText>
          </SuraCard>
        )}
        ListEmptyComponent={
          <SuraText variant="bodyMd" color={Colors.outline} style={{ textAlign: 'center', marginTop: 24 }}>
            Belum ada postingan forum
          </SuraText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    backgroundColor: Colors.secondaryContainer,
    padding: Spacing.gutter,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  list: { padding: Spacing.gutter },
  card: { marginBottom: Spacing.md },
  cat: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
});
