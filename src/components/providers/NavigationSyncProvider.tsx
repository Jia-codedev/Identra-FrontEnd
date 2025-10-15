"use client";
import React from "react";
import { useAuthNavigationSync } from "@/hooks/useAuthNavigation";

const NavigationSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuthNavigationSync();

  return <>{children}</>;
};

export default NavigationSyncProvider;