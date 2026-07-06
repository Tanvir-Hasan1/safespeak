import { create } from "zustand";

export const useDraftStore = create((set) => ({
  title: "Harassment near main corridor",
  date: "sdf",
  location: "main corridor",
  summary: "A manager used threatening language and blocked the reporter's path",
  askQuery: "What support or evidence options should I consider for this report?",

  // Actions
  updateDraft: (fields) => set((state) => ({ ...state, ...fields })),
  resetDraft: () =>
    set({
      title: "",
      date: "",
      location: "",
      summary: "",
      askQuery: "",
    }),
}));
