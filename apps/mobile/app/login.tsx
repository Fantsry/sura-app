import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { SuraText } from '@/components/sura/SuraText';
import { SuraInput } from '@/components/sura/SuraInput';
import { SuraButton } from '@/components/sura/SuraButton';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn(identifier, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoBox}>
          <MaterialIcons name="campaign" size={32} color={Colors.onPrimary} />
        </View>
        <SuraText variant="h1" color={Colors.primary}>
          Sura
        </SuraText>
        <SuraText variant="bodyMd" color={Colors.onSurfaceVariant} style={{ marginBottom: Spacing.xl }}>
          Suara Rakyat — platform laporan warga
        </SuraText>

        {error ? (
          <View style={styles.errorBox}>
            <SuraText variant="bodySm" color={Colors.error}>
              {error}
            </SuraText>
          </View>
        ) : null}

        <SuraInput
          label="Email atau Username"
          placeholder="admin@sura.app"
          autoCapitalize="none"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <SuraInput
          label="Kata Sandi"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <SuraButton title="Masuk Sekarang" onPress={handleLogin} loading={loading} />

        <SuraText variant="bodySm" color={Colors.outline} style={styles.hint}>
          Demo: admin@sura.app / admin123{'\n'}warga@sura.app / user123
        </SuraText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  errorBox: {
    backgroundColor: Colors.errorContainer,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  hint: { textAlign: 'center', marginTop: Spacing.lg },
});
