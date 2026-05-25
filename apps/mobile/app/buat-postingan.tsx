import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraInput } from '@/components/sura/SuraInput';
import { SuraButton } from '@/components/sura/SuraButton';
import { apiRequest, getCurrentLocation } from '@/src/lib/api';

const TAGS = [
  { slug: 'gosip', label: 'Gosip' },
  { slug: 'diskusi', label: 'Diskusi' },
  { slug: 'konspirasi', label: 'Konspirasi' },
  { slug: 'rekomendasi', label: 'Rekomendasi' },
];

const DEFAULT_REGION: Region = {
  latitude: -6.2,
  longitude: 106.816666,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

async function reverseLookup(lat: number, lng: number) {
  try {
    const [geo] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });
    if (geo) {
      return [geo.street, geo.district, geo.city, geo.region]
        .filter(Boolean)
        .join(', ');
    }
  } catch {
    // ignore
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export default function BuatPostinganScreen() {
  const mapRef = useRef<MapView>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('diskusi');
  const [includeLocation, setIncludeLocation] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>(
    []
  );

  useEffect(() => {
    apiRequest<Array<{ id: string; name: string }>>('/forum/categories')
      .then(setCategories)
      .catch(() => {});
  }, []);

  const useCurrentLocation = async () => {
    setLocLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLatitude(loc.latitude);
      setLongitude(loc.longitude);
      setAddress(loc.address ?? '');
      setIncludeLocation(true);
      mapRef.current?.animateToRegion(
        {
          latitude: loc.latitude,
          longitude: loc.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    } catch (e) {
      Alert.alert(
        'Lokasi',
        e instanceof Error ? e.message : 'Gagal mendapatkan lokasi'
      );
    } finally {
      setLocLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (title.length < 5) {
      Alert.alert('Form', 'Judul minimal 5 karakter');
      return;
    }
    if (content.length < 10) {
      Alert.alert('Form', 'Konten minimal 10 karakter');
      return;
    }
    setSubmitting(true);
    try {
      const matched = categories.find((c) =>
        c.name.toLowerCase().includes(tag.toLowerCase())
      );
      const tags: string[] = [tag];
      let finalContent = content;
      if (includeLocation && latitude && longitude) {
        tags.push(`loc:${latitude.toFixed(5)},${longitude.toFixed(5)}`);
        finalContent = `${content}\n\n📍 Lokasi: ${address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}`;
      }
      await apiRequest('/forum/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content: finalContent,
          categoryId: matched?.id ?? categories[0]?.id,
          tags,
        }),
      });
      Alert.alert('Berhasil', 'Postingan berhasil dipublikasikan', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/komunitas') },
      ]);
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Tidak dapat mengirim');
    } finally {
      setSubmitting(false);
    }
  };

  const region: Region =
    latitude && longitude
      ? {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : DEFAULT_REGION;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <SuraText variant="h2" color={Colors.primary}>
          Bagikan ke Komunitas
        </SuraText>
        <SuraText
          variant="bodyMd"
          color={Colors.onSurfaceVariant}
          style={{ marginTop: 4 }}
        >
          Postingan langsung tayang. Untuk laporan resmi, gunakan Buat Laporan.
        </SuraText>
      </View>

      <View style={styles.section}>
        <SuraText variant="labelBold" style={styles.sectionLabel}>
          PILIH KATEGORI
        </SuraText>
        <View style={styles.chips}>
          {TAGS.map((t) => {
            const active = tag === t.slug;
            return (
              <Pressable
                key={t.slug}
                onPress={() => setTag(t.slug)}
                style={[
                  styles.chip,
                  active && {
                    backgroundColor: Colors.primaryFixed,
                    borderColor: Colors.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <SuraText
                  variant="button"
                  color={active ? Colors.primary : Colors.onSurface}
                >
                  {t.label}
                </SuraText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <SuraInput
          label="Judul Postingan"
          value={title}
          onChangeText={setTitle}
          placeholder="Apa yang ingin Anda diskusikan?"
        />
        <SuraInput
          label="Konten"
          value={content}
          onChangeText={setContent}
          placeholder="Ceritakan, beri info, atau mulai diskusi..."
          multiline
          style={{ height: 140, textAlignVertical: 'top', paddingTop: 12 }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.locHeader}>
          <SuraText variant="labelBold" style={styles.sectionLabel}>
            LOKASI (OPSIONAL)
          </SuraText>
          <Pressable onPress={useCurrentLocation} style={styles.gpsLink}>
            <MaterialIcons
              name={locLoading ? 'hourglass-empty' : 'my-location'}
              size={18}
              color={Colors.primary}
            />
            <SuraText variant="button" color={Colors.primary}>
              {locLoading ? 'Mengambil...' : 'Lokasi saya'}
            </SuraText>
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          <SuraText variant="bodyMd">Sertakan lokasi pada postingan</SuraText>
          <Switch
            value={includeLocation}
            onValueChange={setIncludeLocation}
            trackColor={{ true: Colors.primary, false: Colors.outlineVariant }}
          />
        </View>

        {includeLocation && (
          <>
            <View style={styles.mapBox}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                onPress={async (e) => {
                  const { latitude: lat, longitude: lng } =
                    e.nativeEvent.coordinate;
                  setLatitude(lat);
                  setLongitude(lng);
                  setAddress(await reverseLookup(lat, lng));
                }}
                onRegionChangeComplete={(r) => {
                  setLatitude(r.latitude);
                  setLongitude(r.longitude);
                }}
              />
              <View pointerEvents="none" style={styles.pinOverlay}>
                <MaterialIcons
                  name="location-pin"
                  size={44}
                  color={Colors.error}
                />
              </View>
            </View>
            <View style={styles.addrBar}>
              <MaterialIcons
                name="location-on"
                size={18}
                color={Colors.error}
              />
              <SuraText variant="bodySm" numberOfLines={2} style={{ flex: 1 }}>
                {address || 'Geser peta untuk memilih titik'}
              </SuraText>
            </View>
          </>
        )}
      </View>

      <SuraButton
        title="Publikasikan"
        onPress={handleSubmit}
        loading={submitting}
        style={{ marginHorizontal: Spacing.gutter, marginTop: Spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xl },
  headerCard: {
    paddingHorizontal: Spacing.gutter,
    paddingVertical: Spacing.md,
  },
  section: {
    paddingHorizontal: Spacing.gutter,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.sm,
  },
  card: {
    marginHorizontal: Spacing.gutter,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  locHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  mapBox: {
    height: 220,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  map: { flex: 1 },
  pinOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -22,
    marginTop: -44,
  },
  addrBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
});
