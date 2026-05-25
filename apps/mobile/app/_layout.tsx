import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/src/context/AuthContext';
import { initializeTables } from '@/src/lib/database';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      initializeTables().catch(() => {});
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surfaceContainerLowest },
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="report/[id]" options={{ title: 'Detail Laporan' }} />
        <Stack.Screen name="berita" options={{ title: 'Portal Berita' }} />
        <Stack.Screen name="statistik" options={{ title: 'Statistik Publik' }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
