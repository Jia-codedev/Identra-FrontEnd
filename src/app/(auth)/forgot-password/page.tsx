"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import apiClient from "@/configs/api/Axios";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/hooks/use-translations";

function page() {
  const { t } = useTranslations();
  const [loading, setLoading] = React.useState(false);
  const [loginId, setLoginId] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);
  const router = useRouter();
  const timeoutRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const handleSubmit = async () => {
    if (!loginId) {
      toast.error(t("auth.enterLoginRequired"));
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/forgot-password", {
        login: loginId,
      });
      if (res.status === 200) {
        toast.success(t("auth.resetLinkSent"));
        setSent(true);
        setCountdown(5);
        intervalRef.current = window.setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
            return c - 1;
          });
        }, 1000) as unknown as number;

        timeoutRef.current = window.setTimeout(() => {
          router.push("/");
        }, 5000) as unknown as number;
      } else {
        toast.error(t("auth.resetLinkFailed"));
      }
    } catch (error) {
      toast.error(t("auth.resetLinkError"));
    } finally {
      setLoading(false);
    }
  };

  // cleanup timers on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative z-50 h-screen w-full grid place-items-center">
      <Card>
        <CardHeader className="text-2xl font-bold text-center">
          {t("auth.resetPassword")}
        </CardHeader>
        <CardDescription className="text-center px-8">
          {t("auth.forgotPasswordDescription")}
        </CardDescription>
        <CardContent>
          <Input
            onChange={(e) => setLoginId(e.target.value)}
            type="text"
            placeholder={t("auth.enterLogin")}
          />
          <Button onClick={handleSubmit} className="w-full mt-4">
            {loading ? t("auth.sendingResetLink") : t("auth.sendPasswordResetLink")}
          </Button>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35 }}
                className="mt-4 bg-green-50 border border-green-200 rounded-md p-3 text-center"
              >
                <div className="text-sm font-medium text-green-800">
                  {t("auth.resetLinkSentRedirecting", { seconds: countdown })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
