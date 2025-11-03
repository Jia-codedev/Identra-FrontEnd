"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { theme, setTheme } = useTheme();
  const [primaryColor, setPrimaryColorState] = useState('#3b82f6');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setPrimaryColorState(savedColor);
      applyPrimaryColor(savedColor);
    } else {
      applyPrimaryColor('#3b82f6');
    }
  }, [mounted]);
  const applyPrimaryColor = (color: string) => {
    document.documentElement.style.setProperty('--primary', color);
    const root = document.documentElement;
    root.style.setProperty('--color-primary', color);
    
    const lightColor = lightenColor(color, 0.1);
    const darkColor = darkenColor(color, 0.1);
    
    root.style.setProperty('--primary-light', lightColor);
    root.style.setProperty('--primary-dark', darkColor);
  };

  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const darkenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
    applyPrimaryColor(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        theme,
        setTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
