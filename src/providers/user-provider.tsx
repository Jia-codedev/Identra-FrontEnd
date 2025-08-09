"use client";

import { useEffect, useState } from "react";
import userService from "@/services/userService";

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await userService.initializeUser();
      } catch (error) {
        console.error("Failed to initialize user:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, []);
  if (!isInitialized) {
    return <div>Loading...</div>; // or your loading component
  }

  return <>{children}</>;
}
