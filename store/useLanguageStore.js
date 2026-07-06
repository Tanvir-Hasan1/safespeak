import { create } from "zustand";
import translations from "../i18n/translations";

export const useLanguageStore = create((set, get) => ({
  language: "en",
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get();
    return (
      (translations[language] && translations[language][key]) ||
      (translations["en"] && translations["en"][key]) ||
      key
    );
  },
}));
