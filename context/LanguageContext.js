import React, { createContext, useContext, useState, useCallback } from "react";
import translations from "../i18n/translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = useCallback(
    (key) => {
      return (
        (translations[language] && translations[language][key]) ||
        (translations["en"] && translations["en"][key]) ||
        key
      );
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
};
