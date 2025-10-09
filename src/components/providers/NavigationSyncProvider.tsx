"use client";
import React from "react";
import { useAuthNavigationSync } from "@/hooks/useAuthNavigation";

/**
 * Provider component that automatically syncs navigation with authentication
 * Should be placed high in the component tree to ensure navigation loads when user logs in
 */
const NavigationSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This hook automatically loads navigation when user data is available
  useAuthNavigationSync();

  return <>{children}</>;
};

export default NavigationSyncProvider;