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
import { CookieDebugger } from "@/utils/cookieDebugger";
import { Button } from "@/components/ui/button";
import { BiLogoMicrosoft } from "react-icons/bi";
import apiClient from "@/configs/api/Axios";
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
      CookieDebugger.logEnvironment();
      CookieDebugger.testCookies();
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
          console.log("After login - debugging cookies...");
          CookieDebugger.debugCurrentCookies();
        }, 500);

        setTimeout(() => {
          router.push(getRouteFromKey("mainMenu.workforceAnalytics.myInsights"));
        }, 2000);
        reset();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Login error:", error.message);
      } else {
        console.log("Login error:", error);
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-50">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-background to-background z-20 absolute" />
        <Image
          src="/background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="object-cover relative z-0"
          priority
        />
      </div>
      {/* Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="w-full max-w-md bg-card border border-border shadow-2xl rounded px-8 py-10 flex flex-col items-center backdrop-blur-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Image
            src="/logo1.png"
            alt="Chronologix Logo"
            width={98}
            height={48}
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
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "w-full mb-4 p-3 rounded-lg border text-center",
                "bg-red-100 border-red-300 text-red-700",
                "dark:bg-red-950 dark:border-red-800 dark:text-red-300"
              )}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated form/success wrapper */}
        <div className="relative w-full min-h-[270px]">
          <AnimatePresence mode="wait">
            {!submitted && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="w-full space-y-5 absolute left-0 top-0"
                style={{ minHeight: 270 }}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("auth.login")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("auth.enterLogin")}
                    className={`w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                      errors.login ? "border-red-500" : ""
                    }`}
                    {...register("login")}
                    aria-invalid={!!errors.login}
                    aria-describedby={errors.login ? "login-error" : undefined}
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
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.enterPassword")}
                      className={cn(
                        `w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
                          errors.password ? "border-red-500" : ""
                        }`,
                        isRTL ? "pl-10 p-3" : "pr-10 p-3"
                      )}
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? t("auth.hidePassword")
                          : t("auth.showPassword")
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-7s4-7 9-7c1.13 0 2.21.19 3.22.54M17 17l4 4m0 0l-4-4m4 4l-4-4" />
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 1l22 22M17.94 17.94A10.05 10.05 0 0 1 12 19c-5 0-9-4-9-7a9.77 9.77 0 0 1 5.06-7.94M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47" />
                          <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
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
                  <a
                    href="#"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {t("auth.forgotPassword")}
                  </a>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  {t("auth.signIn")}
                </motion.button>
              </motion.form>
            )}
            {submitted && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center py-10 absolute left-0 top-0"
                style={{ minHeight: 270 }}
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
                    transition={{ duration: 0.5, delay: 0.3 }}
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
        </div>
        <div className="pt-6 w-full">
          <div className="h-1 w-full border-b border-muted-foreground relative">
            <p className="absolute -top-2 left-1/2 -translate-x-1/2 bg-card px-2 text-sm text-muted-foreground">
              or
            </p>
          </div>
          <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white flex items-center justify-center">
            <BiLogoMicrosoft className="w-6 h-6 mr-2" />
            <span>{t("auth.signInWithAzure")}</span>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
          {t("auth.dontHaveAccount")}{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            {t("auth.signUp")}
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default AuthComponent;
