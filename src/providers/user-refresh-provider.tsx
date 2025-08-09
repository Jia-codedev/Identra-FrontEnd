"use client";

import { useUserRefreshOnFocus } from "@/hooks/use-user-refresh";

export function UserRefreshProvider({ children }: { children: React.ReactNode }) {
  // Enable auto-refresh on window focus
  useUserRefreshOnFocus(true);

  return <>{children}</>;
}
