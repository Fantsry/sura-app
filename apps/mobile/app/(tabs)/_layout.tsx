import { Tabs, Redirect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLowest,
          borderTopColor: Colors.outlineVariant,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: Colors.surfaceContainerLowest },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="laporanku"
        options={{
          title: 'Laporanku',
          tabBarIcon: ({ color }) => <MaterialIcons name="report-problem" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lapor"
        options={{
          title: 'Lapor',
          tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="komunitas"
        options={{
          title: 'Komunitas',
          tabBarIcon: ({ color }) => <MaterialIcons name="forum" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          tabBarBadge: isAdmin ? 'A' : undefined,
        }}
      />
    </Tabs>
  );
}
