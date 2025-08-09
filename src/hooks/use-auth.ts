"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import authService from "@/services/authService";
import { toast } from "sonner";
import { useTranslations } from "./use-translations";

export const useAuth = () => {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { t } = useTranslations();

  const logout = async () => {
    try {
      await authService.logout();
      clearUser();
      toast.success(t("auth.loggedOutSuccessfully"));
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearUser();
      document.cookie = "_authToken=; path=/; max-age=0; secure; samesite=strict";
      sessionStorage.removeItem("authToken");
      toast.error(t("auth.logoutFailed"));
      router.push("/login");
    }
  };

  return {
    user,
    logout,
    isAuthenticated: !!user,
  };
};
