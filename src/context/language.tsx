// src/context/LanguageContext.ts
import React, { createContext, useContext, useEffect, useMemo } from "react";
import {
  SUPPORTED_LANGUAGES,
  useLanguageStore,
} from "../../stores/languageStore";
import i18n from "../i18n";
interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  supportedLanguages: SUPPORTED_LANGUAGES,
});

// src/context/LanguageProvider.tsx

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedLanguage, setLanguage } = useLanguageStore();

  // Sync i18n on mount & language change
  useEffect(() => {
    if (i18n.language !== selectedLanguage) {
      i18n.changeLanguage("selectedLanguage").catch((e) => {
        console.warn("Failed to change language", e);
      });
    }
  }, [selectedLanguage]);

  const contextValue = useMemo(
    () => ({
      language: selectedLanguage,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [selectedLanguage, setLanguage],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
