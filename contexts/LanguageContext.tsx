'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.fr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr'); // Start with consistent default
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // After hydration, read from localStorage and update if needed
    const storedLang = localStorage.getItem('coinlect_language');
    const initialLang = (storedLang === 'fr' || storedLang === 'en') ? storedLang : 'fr';

    if (initialLang !== language) {
      setLanguage(initialLang);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('coinlect_language', language);
    }
  }, [language, isHydrated]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  // Provide fallback during static generation or when context is not available
  if (!context) {
    return {
      language: 'fr' as Language,
      setLanguage: () => {},
      t: translations.fr,
    };
  }
  return context;
};
