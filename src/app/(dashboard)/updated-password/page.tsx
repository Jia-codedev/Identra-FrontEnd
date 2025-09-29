"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { useTranslations } from "@/hooks/use-translations";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const UpdatedPasswordPage: React.FC = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword", "");

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const getStrengthText = (strength: number) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const onSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.changePassword({
        old_password: data.currentPassword,
        new_password: data.newPassword,
      });

      setSuccess(true);
      localStorage.removeItem("token");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setTimeout(() => {
        router.refresh();
      }, 3000);
    } catch (error: any) {
      console.error("Password change error:", error);
      setError(
        error?.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-primary/5 via-background to-background rounded-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
            Password Updated Successfully!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-6">
            Your password has been changed. You will be redirected to the
            Login page shortly.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
        >
          <Lock className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">Update Password</h1>
        <p className="text-muted-foreground text-lg">
          Enter your current password and choose a new secure password
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Form Section */}
      <div className="bg-card rounded-lg border p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-3">
            <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password"
                {...register("currentPassword")}
                className={`h-11 ${errors.currentPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-3">
            <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("newPassword")}
                className={`h-11 ${errors.newPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>Password Strength</span>
                  <span
                    className={`font-medium ${
                      getPasswordStrength(newPassword) < 50
                        ? "text-red-500"
                        : getPasswordStrength(newPassword) < 75
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {getStrengthText(getPasswordStrength(newPassword))}
                  </span>
                </div>
                <Progress
                  value={getPasswordStrength(newPassword)}
                  className="h-2"
                />
              </motion.div>
            )}

            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={`h-11 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating Password...
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>

      {/* Password Requirements */}
      <div className="bg-muted/30 rounded-lg border p-6">
        <h3 className="text-sm font-medium mb-4 text-center">
          Password Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">At least 8 characters</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">One uppercase letter</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                /[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">One lowercase letter</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                /[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">One number</span>
          </div>
          <div className="flex items-center gap-3 text-sm md:col-span-2 justify-center">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                /[^A-Za-z0-9]/.test(newPassword)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-muted-foreground">One special character</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatedPasswordPage;
