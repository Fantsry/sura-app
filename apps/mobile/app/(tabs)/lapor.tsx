import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraInput } from '@/components/sura/SuraInput';
import { SuraButton } from '@/components/sura/SuraButton';
import { api, getCurrentLocation } from '@/src/lib/api';
import { router } from 'expo-router';

const CATEGORIES = [
  { slug: 'bencana', label: 'Bencana Alam' },
  { slug: 'pencurian', label: 'Pencurian' },
  { slug: 'event', label: 'Event' },
  { slug: 'lainnya', label: 'Lainnya' },
];

export default function LaporScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLatitude(loc.latitude);
      setLongitude(loc.longitude);
      setAddress(loc.address ?? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    } catch (e) {
      Alert.alert('Lokasi', e instanceof Error ? e.message : 'Gagal mendapatkan lokasi');
    } finally {
      setLocLoading(false);
    }
  };

  useEffect(() => {
    loadLocation();
  }, []);

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      Alert.alert('Lokasi', 'Lokasi wajib. Ketuk tombol GPS untuk memperbarui.');
      return;
    }
    if (!categorySlug || !title || !description) {
      Alert.alert('Form', 'Lengkapi semua field');
      return;
    }
    setSubmitting(true);
    try {
      await api.createReport({
        title,
        description,
        categorySlug,
        latitude,
        longitude,
        address,
        isAnonymous,
      });
      Alert.alert('Berhasil', 'Laporan Anda telah dikirim', [
        { text: 'OK', onPress: () => router.push('/(tabs)/laporanku') },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Tidak dapat mengirim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SuraText variant="h2" color={Colors.primary} style={{ marginBottom: Spacing.sm }}>
        Suarakan Aspirasimu
      </SuraText>
      <SuraText variant="bodyMd" color={Colors.onSurfaceVariant} style={{ marginBottom: Spacing.lg }}>
        Lokasi diambil otomatis dari perangkat Anda saat ini.
      </SuraText>

      <View style={styles.card}>
        <SuraText variant="labelBold" style={{ marginBottom: Spacing.sm }}>
          KATEGORI
        </SuraText>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <SuraButton
              key={c.slug}
              title={c.label}
              variant={categorySlug === c.slug ? 'primary' : 'outline'}
              onPress={() => setCategorySlug(c.slug)}
              style={styles.chip}
            />
          ))}
        </View>

        <SuraInput label="JUDUL LAPORAN" value={title} onChangeText={setTitle} placeholder="Contoh: Pohon tumbang" />
        <SuraInput
          label="DESKRIPSI"
          value={description}
          onChangeText={setDescription}
          placeholder="Jelaskan detail kejadian..."
          multiline
          style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
        />

        <SuraText variant="labelBold">LOKASI SAAT INI</SuraText>
        <View style={styles.mapBox}>
          {latitude && longitude ? (
            <MapView
              style={styles.map}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <SuraText variant="bodySm" color={Colors.outline}>
                Menunggu lokasi...
              </SuraText>
            </View>
          )}
          <View style={styles.locBar}>
            <MaterialIcons name="location-on" size={18} color={Colors.error} />
            <SuraText variant="bodySm" numberOfLines={2} style={{ flex: 1 }}>
              {address || '—'}
            </SuraText>
          </View>
          <View style={styles.gpsBtn}>
            <SuraButton
              title={locLoading ? '...' : 'GPS'}
              variant="outline"
              onPress={loadLocation}
              loading={locLoading}
              style={{ width: 72, height: 40 }}
            />
          </View>
        </View>

        <View style={styles.anonRow}>
          <SuraText variant="bodySm">Laporkan secara anonim</SuraText>
          <Switch value={isAnonymous} onValueChange={setIsAnonymous} trackColor={{ true: Colors.primary }} />
        </View>

        <SuraButton title="Kirim Aduan" onPress={handleSubmit} loading={submitting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.gutter, paddingBottom: Spacing.xl },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.lg,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  chip: { height: 36, paddingHorizontal: 12 },
  mapBox: { height: 180, borderRadius: Radius.md, overflow: 'hidden', marginVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.outlineVariant },
  map: { flex: 1 },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceContainerLow },
  locBar: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  gpsBtn: { position: 'absolute', top: Spacing.sm, right: Spacing.sm },
  anonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.md },
});
