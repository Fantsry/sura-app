import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
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
    <Pressable
      style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <MaterialIcons name={icon} size={20} color={Colors.primary} />
      </View>
      <SuraText variant="bodyMd" style={{ flex: 1 }}>
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
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

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

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero card */}
      <View style={styles.hero}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <SuraText variant="h1" color={Colors.onPrimary}>
              {initial}
            </SuraText>
          </View>
        </View>
        <SuraText variant="h2">{user?.fullName ?? 'Pengguna'}</SuraText>
        <View style={styles.verifyChip}>
          <MaterialIcons name="verified" size={14} color={Colors.onSecondaryContainer} />
          <SuraText variant="labelBold" color={Colors.onSecondaryContainer}>
            {user?.isVerified ? 'WARGA TERVERIFIKASI' : 'WARGA'}
          </SuraText>
        </View>

        <View style={styles.pointsBox}>
          <View style={styles.pointsHeader}>
            <SuraText variant="bodySm" color={Colors.onSurfaceVariant}>
              Poin Kontribusi
            </SuraText>
            <SuraText variant="button" color={Colors.primary}>
              {user?.points ?? 0} Pts
            </SuraText>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, ((user?.points ?? 0) / 1500) * 100)}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Stat row */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <MaterialIcons name="description" size={22} color={Colors.primary} />
          <SuraText variant="h2">{user?.role === 'admin' ? '∞' : '0'}</SuraText>
          <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
            LAPORAN
          </SuraText>
        </View>
        <View style={styles.statBox}>
          <MaterialIcons name="check-circle" size={22} color={Colors.success} />
          <SuraText variant="h2">{user?.role === 'admin' ? '∞' : '0'}</SuraText>
          <SuraText variant="labelBold" color={Colors.onSurfaceVariant}>
            SELESAI
          </SuraText>
        </View>
      </View>

      {/* Menu sections */}
      <SuraText variant="labelBold" color={Colors.outline} style={styles.sectionLabel}>
        AKSI CEPAT
      </SuraText>
      <View style={styles.menu}>
        <MenuRow
          icon="newspaper"
          label="Portal Berita"
          onPress={() => router.push('/berita')}
        />
        <MenuRow
          icon="bar-chart"
          label="Statistik Publik"
          onPress={() => router.push('/statistik')}
        />
        <MenuRow
          icon="add-circle"
          label="Buat Laporan Baru"
          onPress={() => router.push('/(tabs)/lapor')}
        />
        {isAdmin ? (
          <>
            <MenuRow
              icon="dashboard"
              label="Dashboard Admin"
              onPress={() => router.push('/admin')}
              badge="ADMIN"
            />
            <MenuRow
              icon="assignment"
              label="Kelola Laporan"
              onPress={() => router.push('/admin/laporan')}
            />
          </>
        ) : null}
      </View>

      {/* Notification settings */}
      <SuraText variant="labelBold" color={Colors.outline} style={styles.sectionLabel}>
        NOTIFIKASI
      </SuraText>
      <View style={styles.menu}>
        <View style={styles.toggleRow}>
          <View style={styles.menuIcon}>
            <MaterialIcons
              name="notifications-active"
              size={20}
              color={Colors.primary}
            />
          </View>
          <SuraText variant="bodyMd" style={{ flex: 1 }}>
            Push Notifications
          </SuraText>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            trackColor={{ true: Colors.primary, false: Colors.outlineVariant }}
          />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.menuIcon}>
            <MaterialIcons name="email" size={20} color={Colors.primary} />
          </View>
          <SuraText variant="bodyMd" style={{ flex: 1 }}>
            Email Updates
          </SuraText>
          <Switch
            value={emailNotif}
            onValueChange={setEmailNotif}
            trackColor={{ true: Colors.primary, false: Colors.outlineVariant }}
          />
        </View>
      </View>

      <SuraButton
        title="Keluar"
        variant="outline"
        onPress={handleLogout}
        style={{ marginTop: Spacing.lg, marginHorizontal: Spacing.gutter }}
      />

      <SuraText
        variant="bodySm"
        color={Colors.outline}
        style={{ textAlign: 'center', marginTop: Spacing.lg }}
      >
        © 2024 Sura — Suara Rakyat
      </SuraText>
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
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: Colors.primaryFixed,
    padding: 4,
    marginBottom: Spacing.md,
  },
  avatar: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  pointsBox: {
    width: '100%',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.gutter,
    marginTop: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 4,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.gutter,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  menu: {
    marginHorizontal: Spacing.gutter,
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
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
});
