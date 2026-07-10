import { create } from "zustand";

export const useScamShieldStore = create((set) => ({
  currentAnalysis: null,

  // Actions
  setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  resetAnalysis: () => set({ currentAnalysis: null }),
}));
