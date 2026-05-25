import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraButton } from '@/components/sura/SuraButton';
import { useAuth } from '@/src/context/AuthContext';

function MenuRow({
  icon,
  label,
  onPress,
  badge,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: string;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <MaterialIcons name={icon} size={22} color={Colors.primary} />
      <SuraText variant="bodyMd" style={{ flex: 1, marginLeft: Spacing.md }}>
        {label}
      </SuraText>
      {badge ? (
        <View style={styles.badge}>
          <SuraText variant="labelBold" color={Colors.onPrimary}>
            {badge}
          </SuraText>
        </View>
      ) : null}
      <MaterialIcons name="chevron-right" size={22} color={Colors.outline} />
    </Pressable>
  );
}

export default function ProfilScreen() {
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <SuraText variant="h2" color={Colors.onPrimary}>
            {user?.fullName?.charAt(0) ?? '?'}
          </SuraText>
        </View>
        <SuraText variant="h2">{user?.fullName}</SuraText>
        <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
          @{user?.username}
        </SuraText>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <SuraText variant="h3">{user?.points ?? 0}</SuraText>
            <SuraText variant="labelBold" color={Colors.outline}>
              POIN
            </SuraText>
          </View>
          <View style={styles.stat}>
            <SuraText variant="h3">{isAdmin ? 'Admin' : 'Warga'}</SuraText>
            <SuraText variant="labelBold" color={Colors.outline}>
              PERAN
            </SuraText>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuRow icon="newspaper" label="Portal Berita" onPress={() => router.push('/berita')} />
        <MenuRow icon="bar-chart" label="Statistik Publik" onPress={() => router.push('/statistik')} />
        {isAdmin ? (
          <>
            <MenuRow icon="dashboard" label="Dashboard Admin" onPress={() => router.push('/admin')} badge="ADMIN" />
            <MenuRow icon="assignment" label="Kelola Laporan" onPress={() => router.push('/admin/laporan')} />
          </>
        ) : null}
      </View>

      <SuraButton title="Keluar" variant="outline" onPress={handleLogout} style={{ marginTop: Spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xl },
  hero: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  stats: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.lg },
  stat: { alignItems: 'center' },
  menu: {
    margin: Spacing.gutter,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
});
