"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "@/hooks/use-translations";
import { useAuth } from "@/hooks/use-auth";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslations();
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Call the logout logic (if any server-side/session logic)
    await logout();

    // Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.clear();

      // Delete all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });
    }

    // Route to root
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("auth.confirmLogout")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("auth.logoutConfirmationMessage")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            {t("auth.logout")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
