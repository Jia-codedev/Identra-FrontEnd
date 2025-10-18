"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "../schema/login";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";
import { getRouteFromKey } from "@/utils/routeFromKey";
import { Button } from "@/components/ui/button";
import { BiLogoMicrosoft } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import Link from "next/link";
function AuthComponent() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login({
        login: data.login,
        password: data.password,
        rememberMe: data.rememberMe || false,
      });
      if (response.status === 401) {
        setError(t("auth.invalidCredentials"));
        return;
      } else {
        setError(null);
        setSubmitted(true);
        setTimeout(() => {
          router.push(
            getRouteFromKey("mainMenu.workforceAnalytics.myInsights")
          );
        }, 2000);
        reset();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
      } else {
      }
      setError(t("auth.loginFailed"));
      setSubmitted(false);
    }
  };
  const onAdLogin = async () => {
    const res = await authService.adlogin();
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="w-full max-w-md bg-card border border-border shadow-lg rounded-2xl px-6 py-8 flex flex-col items-center gap-4 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Image
            src="/logo-full.svg"
            alt="Chronologix Logo"
            width={100}
            height={30}
            className="mb-6"
          />
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-3xl font-bold text-primary text-center mb-2 tracking-tight"
        >
          {t("auth.welcomeBack")}
        </motion.h2>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: "spring" }}
          className="text-muted-foreground text-center mb-6 text-base"
        >
          {t("auth.signInToAccount")}
        </motion.p>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-full mb-2 p-3 rounded-lg border text-center",
                "bg-red-100 border-red-300 text-red-700",
                "dark:bg-red-950 dark:border-red-800 dark:text-red-300"
              )}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("auth.login")}
                </label>
                <input
                  id="login"
                  type="text"
                  placeholder={t("auth.enterLogin")}
                  autoComplete="username"
                  className={cn(
                    "w-full p-3 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
                    errors.login ? "border-red-500" : ""
                  )}
                  {...register("login")}
                  aria-invalid={!!errors.login}
                  aria-describedby={errors.login ? "login-error" : undefined}
                  disabled={submitted}
                />
                {errors.login && (
                  <div id="login-error" className="text-red-500 text-xs mt-1">
                    {errors.login.message}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.enterPassword")}
                    autoComplete="current-password"
                    className={cn(
                      "w-full p-3 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition",
                      errors.password ? "border-red-500" : "",
                      isRTL ? "pl-10" : "pr-10"
                    )}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    disabled={submitted}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition",
                      isRTL ? "left-3" : "right-3"
                    )}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")
                    }
                  >
                    {showPassword ? (
                      <FaRegEye size={20} />
                    ) : (
                      <FaRegEyeSlash size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div
                    id="password-error"
                    className="text-red-500 text-xs mt-1"
                  >
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="accent-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    {t("auth.rememberMe")}
                  </label>
                </div>
                <Link
                  href={"/forgot-password"}
                  className="text-primary text-xs font-medium hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                disabled={submitted}
              >
                {t("auth.signIn")}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center py-6"
            >
              <svg
                className="mb-4"
                width={48}
                height={48}
                viewBox="0 0 24 24"
                fill="none"
              >
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#22c55e"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  d="M8 12l2.5 2.5L16 9"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                />
              </svg>
              <div className="text-lg font-semibold text-primary mb-1">
                {t("auth.signedIn")}
              </div>
              <div className="text-muted-foreground text-sm">
                {t("auth.redirecting")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pt-1 w-full">
          <div className="h-1 w-full border-b border-muted-foreground/30 relative">
            <p className="absolute -top-2 left-1/2 -translate-x-1/2 bg-card px-2 text-sm text-muted-foreground">
              or
            </p>
          </div>
          <Button
            type="button"
            variant={"outline"}
            className="w-full mt-6 bg-transparent hover:bg-secondary/5 text-foreground flex items-center justify-center py-3"
            onClick={onAdLogin}
          >
            <BiLogoMicrosoft className="w-6 h-6 mr-2" />
            <span>{t("auth.signInWithAzure")}</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthComponent;
