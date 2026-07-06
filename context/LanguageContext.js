import React from "react";
import { useLanguageStore } from "../store/useLanguageStore";

// Retained as a pass-through to ensure top-level layouts wrapping children in <LanguageProvider> continue to function without error.
export const LanguageProvider = ({ children }) => {
  return <>{children}</>;
};

export const useLanguage = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = useLanguageStore((state) => state.t);

  return { language, setLanguage, t };
};
