import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// In-memory storage fallback for web platform
const inMemoryStore: Record<string, string> = {};

export async function saveToStorage(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    // Use localStorage on web platform
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Fallback to in-memory if localStorage fails
      inMemoryStore[key] = value;
    }
  } else {
    // Use SecureStore on native platforms
    await SecureStore.setItemAsync(key, value);
  }
}

export async function getFromStorage(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    // Check localStorage first
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) return storedValue;
    } catch (e) {
      // Ignore error
    }
    // Fallback to in-memory
    return inMemoryStore[key] || null;
  } else {
    // Use SecureStore on native platforms
    return await SecureStore.getItemAsync(key);
  }
}

export async function removeFromStorage(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Ignore error
    }
    delete inMemoryStore[key];
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}
