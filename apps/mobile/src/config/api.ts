import { Platform } from 'react-native';
import Constants from 'expo-constants';

/** Gunakan EXPO_PUBLIC_API_URL di .env, atau default per platform */
const envUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  envUrl ??
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api');

export const APP_NAME = Constants.expoConfig?.name ?? 'Sura';
