import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
  createdAt: string;
  author?: { fullName: string };
  category?: { name: string; color: string };
};

const FILTERS = [
  { key: 'hot', label: 'Hot Topics', icon: 'local-fire-department' as const },
  { key: 'new', label: 'Terbaru', icon: 'new-releases' as const },
  { key: 'top', label: 'Populer', icon: 'trending-up' as const },
];

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

export default function KomunitasScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'hot' | 'new' | 'top'>('hot');

  const load = useCallback(async () => {
    const data = (await api.getForumPosts().catch(() => [])) as Post[];
    setPosts(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = [...posts].sort((a, b) => {
    if (filter === 'top') return b.likeCount - a.likeCount;
    if (filter === 'new')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // hot: by comment count
    return b.commentCount - a.commentCount;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <SuraText variant="h2" color={Colors.primary}>
                Komunitas Forum
              </SuraText>
              <SuraText
                variant="bodySm"
                color={Colors.onSurfaceVariant}
                style={{ marginTop: 4 }}
              >
                Diskusi bebas warga. Tidak melalui verifikasi formal admin
                seperti laporan resmi.
              </SuraText>
            </View>

            {/* Composer trigger */}
            <Pressable
              style={styles.composer}
              onPress={() => router.push('/buat-postingan')}
            >
              <View style={styles.avatar}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color={Colors.onPrimary}
                />
              </View>
              <SuraText
                variant="bodyMd"
                color={Colors.onSurfaceVariant}
                style={{ flex: 1 }}
              >
                Apa yang ingin Anda diskusikan hari ini?
              </SuraText>
              <MaterialIcons name="image" size={22} color={Colors.primary} />
            </Pressable>

            {/* Filter chips */}
            <View style={styles.filters}>
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => setFilter(f.key as typeof filter)}
                    style={[
                      styles.filterChip,
                      active && {
                        backgroundColor: Colors.primary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={f.icon}
                      size={16}
                      color={active ? Colors.onPrimary : Colors.onSurface}
                    />
                    <SuraText
                      variant="button"
                      color={active ? Colors.onPrimary : Colors.onSurface}
                    >
                      {f.label}
                    </SuraText>
                  </Pressable>
                );
              })}
            </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await load();
              setRefreshing(false);
            }}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <SuraCard style={styles.card}>
            <View style={styles.row}>
              <View
                style={[
                  styles.cat,
                  {
                    backgroundColor: `${item.category?.color ?? Colors.primary}22`,
                  },
                ]}
              >
                <SuraText
                  variant="labelBold"
                  color={item.category?.color ?? Colors.primary}
                >
                  #{item.category?.name ?? 'Umum'}
                </SuraText>
              </View>
              <SuraText variant="bodySm" color={Colors.outline}>
                {timeAgo(item.createdAt)}
              </SuraText>
            </View>
            <SuraText variant="h3" style={{ marginVertical: 6 }}>
              {item.title}
            </SuraText>
            <SuraText
              variant="bodyMd"
              color={Colors.onSurfaceVariant}
              numberOfLines={3}
            >
              {item.content}
            </SuraText>
            <View style={styles.footer}>
              <View style={styles.statRow}>
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={16}
                  color={Colors.outline}
                />
                <SuraText variant="bodySm" color={Colors.outline}>
                  {item.commentCount} komentar
                </SuraText>
              </View>
              <View style={styles.statRow}>
                <MaterialIcons
                  name="thumb-up-off-alt"
                  size={16}
                  color={Colors.outline}
                />
                <SuraText variant="bodySm" color={Colors.outline}>
                  {item.likeCount}
                </SuraText>
              </View>
              <SuraText
                variant="bodySm"
                color={Colors.onSurfaceVariant}
                style={{ marginLeft: 'auto' }}
              >
                @{item.author?.fullName?.split(' ')[0] ?? 'warga'}
              </SuraText>
            </View>
          </SuraCard>
        )}
        ListEmptyComponent={
          <SuraText
            variant="bodyMd"
            color={Colors.outline}
            style={{ textAlign: 'center', marginTop: 24 }}
          >
            Belum ada postingan forum
          </SuraText>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/buat-postingan')}>
        <MaterialIcons name="add" size={28} color={Colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  banner: {
    backgroundColor: Colors.secondaryContainer,
    padding: Spacing.gutter,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  list: { padding: Spacing.gutter, paddingBottom: 100 },
  card: { marginBottom: Spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cat: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
