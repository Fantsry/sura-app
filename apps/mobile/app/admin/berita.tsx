import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraInput } from '@/components/sura/SuraInput';
import { SuraButton } from '@/components/sura/SuraButton';
import { api } from '@/src/lib/api';
import { useAuth } from '@/src/context/AuthContext';

export default function AdminBeritaScreen() {
  const { isAdmin } = useAuth();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <SuraText>Akses Ditolak</SuraText>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!title || !content || !excerpt || !category) {
      Alert.alert('Error', 'Semua kolom wajib diisi.');
      return;
    }
    
    setLoading(true);
    try {
      await api.createNews({
        title,
        content,
        excerpt,
        categoryId: category,
        isFeatured: false,
      });
      Alert.alert('Sukses', 'Berita berhasil dipublikasikan!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Gagal', e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan berita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SuraText variant="h2" color={Colors.primary} style={{ marginBottom: Spacing.sm }}>
        Buat Berita Baru
      </SuraText>
      <SuraText variant="bodyMd" color={Colors.onSurfaceVariant} style={{ marginBottom: Spacing.xl }}>
        Publikasikan pengumuman atau berita terbaru untuk warga.
      </SuraText>

      <SuraInput
        label="Judul Berita"
        value={title}
        onChangeText={setTitle}
        placeholder="Masukkan judul berita"
      />

      <SuraInput
        label="Kategori / Topik"
        value={category}
        onChangeText={setCategory}
        placeholder="Misal: Keamanan, Infrastruktur"
      />

      <SuraInput
        label="Ringkasan (Excerpt)"
        value={excerpt}
        onChangeText={setExcerpt}
        placeholder="Ringkasan singkat berita..."
        multiline
        style={{ height: 80, textAlignVertical: 'top' }}
      />

      <SuraInput
        label="Konten Berita"
        value={content}
        onChangeText={setContent}
        placeholder="Tuliskan isi berita secara detail..."
        multiline
        style={{ height: 180, textAlignVertical: 'top' }}
      />

      <SuraButton
        title="Publikasikan Berita"
        onPress={handleSubmit}
        loading={loading}
        style={{ marginTop: Spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.gutter, paddingBottom: Spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
