import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { getCachedItemSync } from './storage';

/**
 * Check if the user has disabled vibrations in settings.
 */
const areVibrationsDisabled = (): boolean => {
  try {
    const saved = getCachedItemSync('gym_checklist_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return !!parsed.disableVibrations;
    }
  } catch (e) {
    // default to false if storage is unreadable
  }
  return false;
};

/**
 * Trigger a light tactile bump for checkboxes, toggle actions, or small buttons.
 */
export const triggerLightHaptic = async () => {
  if (areVibrationsDisabled()) return;
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.warn('Haptics light impact failed:', e);
    }
  }
};

/**
 * Trigger a medium tactile bump for secondary buttons, list item swaps, or expansions.
 */
export const triggerMediumHaptic = async () => {
  if (areVibrationsDisabled()) return;
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      console.warn('Haptics medium impact failed:', e);
    }
  }
};

/**
 * Trigger a rapid selection change bump for switching nav tabs.
 */
export const triggerSelectionHaptic = async () => {
  if (areVibrationsDisabled()) return;
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.selectionStart();
    } catch (e) {
      console.warn('Haptics selection failed:', e);
    }
  }
};

/**
 * Trigger a premium success vibration pattern for goals met, form submissions, or onboarding completed.
 */
export const triggerSuccessHaptic = async () => {
  if (areVibrationsDisabled()) return;
  if (Capacitor.isNativePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      console.warn('Haptics success notification failed:', e);
    }
  }
};
