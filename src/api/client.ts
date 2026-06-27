import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

/**
 * Base URL of the BeOnEdge backend.
 *
 * Override it by setting `EXPO_PUBLIC_API_URL` in a `.env` file, e.g.
 *   EXPO_PUBLIC_API_URL=http://192.168.1.10:4444
 * (use your machine's LAN IP when testing on a physical device — `localhost`
 * points at the phone itself).
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4444';

const TOKEN_KEY = 'beonedge.auth.token';

// Kept in memory so the request interceptor stays synchronous.
let inMemoryToken: string | null = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }
  return config;
});

export async function loadToken(): Promise<string | null> {
  inMemoryToken = await AsyncStorage.getItem(TOKEN_KEY);
  return inMemoryToken;
}

export async function setToken(token: string): Promise<void> {
  inMemoryToken = token;
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  inMemoryToken = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return inMemoryToken;
}

/**
 * Normalises the many shapes the backend uses for error responses
 * (`{ message }`, `{ error }`, or a plain string) into a single string.
 */
export function extractErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  const axiosErr = err as AxiosError<any>;
  const data = axiosErr?.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data && typeof data === 'object') {
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
