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
      toast.success(t("auth.loggedOutSuccessfully"));
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear user data even if logout request fails
      clearUser();
      toast.error(t("auth.logoutFailed"));
      router.push("/login");
    }
  };

  return {
    user,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};
