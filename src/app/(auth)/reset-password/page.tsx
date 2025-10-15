"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import apiClient from "@/configs/api/Axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/hooks/use-translations";

function page() {
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const loginId = searchParams?.get("loginId") || "";
  const router = useRouter();

  const [valid, setValid] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const timeoutRef = React.useRef<number | null>(null);

  const isJwtExpired = (t: string) => {
    try {
      const parts = t.split(".");
      if (parts.length !== 3) return true;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      if (!payload.exp) return true;
      return Date.now() / 1000 >= payload.exp;
    } catch (err) {
      return true;
    }
  };

  React.useEffect(() => {
    // verify token param presence and expiry
    if (!token) {
      setValid(false);
      return;
    }
    const expired = isJwtExpired(token);
    setValid(!expired);
  }, [token]);

  const handleReset = async () => {
      if (!newPassword || newPassword.length < 6) {
      toast.error(t("auth.passwordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("auth.passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post(
        "/auth/reset-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        toast.success(t("auth.resetSuccessRedirecting"));
        timeoutRef.current = window.setTimeout(
          () => router.push("/"),
          2000
        ) as unknown as number;
      } else {
        toast.error(res.data?.message || t("auth.resetFailed"));
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative z-50 h-screen w-full grid place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-2xl font-bold text-center">
          {t("auth.resetPassword")}
        </CardHeader>
        <CardDescription className="text-center px-8">
          {valid === null
            ? t("auth.checkingResetLink")
            : valid
            ? t("auth.resetPasswordFor", { login: loginId || t("auth.yourAccount") })
            : t("auth.resetLinkInvalid")}
        </CardDescription>
        <CardContent>
          <AnimatePresence>
            {valid && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <Input
                  type="password"
                  placeholder={t("auth.newPasswordPlaceholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder={t("auth.confirmNewPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handleReset} className="w-full mt-2">
                  {loading ? t("auth.resetting") : t("auth.resetPassword")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {valid === false && (
            <div className="mt-4 text-center">
              <div className="text-sm text-red-700">
                {t("auth.resetLinkInvalid")}
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => router.push("/forgot-password")}
              >
                {t("auth.requestNewResetLink")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
