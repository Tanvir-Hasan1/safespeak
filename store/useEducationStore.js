import { create } from "zustand";

export const useEducationStore = create((set) => ({
  items: [],
  selectedGuideId: null,
  setItems: (items) => set({ items }),
  setSelectedGuideId: (selectedGuideId) => set({ selectedGuideId }),
}));
