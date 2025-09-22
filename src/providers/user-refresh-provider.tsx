"use client";

import { useUserRefreshOnFocus } from "@/hooks/use-user-refresh";

export function UserRefreshProvider({ children }: { children: React.ReactNode }) {
  useUserRefreshOnFocus(true);

  return <>{children}</>;
}
