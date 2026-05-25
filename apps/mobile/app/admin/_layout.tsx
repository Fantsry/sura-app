import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surfaceContainerLowest },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dashboard Admin' }} />
      <Stack.Screen name="laporan" options={{ title: 'Kelola Laporan' }} />
    </Stack>
  );
}
