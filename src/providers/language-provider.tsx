"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { locales, defaultLocale } from "@/i18n/config";

interface LanguageContextType {
  currentLocale: string;
  setLanguage: (locale: string) => void;
  isRTL: boolean;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLocale = defaultLocale,
}) => {
  const [currentLocale, setCurrentLocale] = useState(initialLocale);
  const [isInitialized, setIsInitialized] = useState(false);

  const isRTL = currentLocale === "ar";
  const setLanguage = (locale: string) => {
    if ((locales as readonly string[]).includes(locale)) {
      setCurrentLocale(locale);
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
      localStorage.setItem("preferred-language", locale);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (
      savedLanguage &&
      (locales as readonly string[]).includes(savedLanguage)
    ) {
      setCurrentLocale(savedLanguage);
    }

    document.documentElement.dir = currentLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLocale;

    setIsInitialized(true);
  }, [currentLocale]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLocale;
  }, [currentLocale, isRTL]);

  const value: LanguageContextType = {
    currentLocale,
    setLanguage,
    isRTL,
    isInitialized,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
