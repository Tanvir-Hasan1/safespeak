import { create } from "zustand";

export const useProfileStore = create((set) => ({
  // Profile preferences defaults
  culturalProfile: "Aboriginal and Torres Strait Islander",
  faithProfile: "Muslim",
  communityBg: "Migrant",
  interpreterLang: "English",
  shareContext: false,

  // Consent Center defaults
  aiProcessing: true,
  audioTranscription: false,
  cloudSync: true,
  warmReferral: true,
  externalSharing: false,
  anonymisedAnalytics: false,

  // Actions
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
  setConsent: (consents) => set((state) => ({ ...state, ...consents })),
}));
