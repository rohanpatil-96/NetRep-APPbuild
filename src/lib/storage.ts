import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

// Memory cache to allow fast, synchronous lookups of key-value pairs
const syncCache: Record<string, string> = {};

/**
 * Preloads the synchronous cache with values from storage on app startup.
 */
export const initStorageCache = async (keys: string[]): Promise<void> => {
  for (const key of keys) {
    try {
      let value: string | null = null;
      if (Capacitor.isNativePlatform()) {
        const result = await Preferences.get({ key });
        value = result.value;
      } else {
        value = localStorage.getItem(key);
      }
      if (value !== null) {
        syncCache[key] = value;
      }
    } catch (e) {
      console.warn(`Failed to preload key: ${key}`, e);
    }
  }
};

/**
 * Gets a value asynchronously from storage.
 */
export const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key });
      if (value !== null) {
        syncCache[key] = value;
      }
      return value;
    } else {
      const value = localStorage.getItem(key);
      if (value !== null) {
        syncCache[key] = value;
      }
      return value;
    }
  } catch (e) {
    console.warn(`Error getting storage item for key ${key}:`, e);
    return syncCache[key] || null;
  }
};

/**
 * Sets a value in storage and updates the sync cache.
 */
export const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    syncCache[key] = value;
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`Error setting storage item for key ${key}:`, e);
  }
};

/**
 * Removes a value from storage and updates the sync cache.
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    delete syncCache[key];
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`Error removing storage item for key ${key}:`, e);
  }
};

/**
 * A fast, synchronous reader to retrieve cached variables instantly (e.g. for haptics config).
 */
export const getCachedItemSync = (key: string): string | null => {
  return syncCache[key] || null;
};
