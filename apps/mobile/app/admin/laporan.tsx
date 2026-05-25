import { Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import AdminDashboardScreen from './index';

/** Alias layar kelola laporan — memakai dashboard moderasi */
export default function AdminLaporanScreen() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Redirect href="/(tabs)/profil" />;
  return <AdminDashboardScreen />;
}
