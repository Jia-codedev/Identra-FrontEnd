"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColorContextType = {
  primary: string;
  setPrimary: (color: string) => void;
};

const ThemeColorContext = createContext<ThemeColorContextType>({
  primary: "#6B21A8", // default purple
  setPrimary: () => {},
});

export const useThemeColor = () => useContext(ThemeColorContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [primary, setPrimary] = useState("#6B21A8"); // Use 'primary' instead of 'color'

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("primary-color");
    const initialColor = saved || "#6B21A8";
    setPrimary(initialColor);
    document.documentElement.style.setProperty("--primary", initialColor);
  }, []);

  // Update CSS variable and save to localStorage on change
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primary);
    localStorage.setItem("primary-color", primary);
  }, [primary]);

  return (
    <ThemeColorContext.Provider value={{ primary, setPrimary }}>
      {children}
    </ThemeColorContext.Provider>
  );
};
