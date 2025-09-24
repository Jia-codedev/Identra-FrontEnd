"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useBiometricTerminalMutations from "../hooks/useBiometricTerminalMutations";
import { BiometricTerminal } from "@/services/biometric-terminals/biometricTerminalsApi";

interface BiometricTerminalFormProps {
  terminal?: BiometricTerminal | null;
  onClose: (refresh?: boolean) => void;
}

export default function BiometricTerminalForm({
  terminal,
  onClose,
}: BiometricTerminalFormProps) {
  const { t } = useTranslations();
  const mutations = useBiometricTerminalMutations();

  const [formData, setFormData] = useState({
    device_no: "",
    device_name: "",
    device_status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (terminal) {
      setFormData({
        device_no: terminal.device_no || "",
        device_name: terminal.device_name || "",
        device_status: terminal.device_status ?? true,
      });
    } else {
      setFormData({
        device_no: "",
        device_name: "",
        device_status: true,
      });
    }
  }, [terminal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.device_no.trim()) {
      newErrors.device_no = t("biometricTerminals.enterTerminalNumber");
    }
    if (!formData.device_name.trim()) {
      newErrors.device_name = t("biometricTerminals.enterTerminalName");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (terminal) {
        await mutations.updateBiometricTerminal.mutateAsync({
          id: terminal.device_id,
          data: formData,
        });
      } else {
        await mutations.createBiometricTerminal.mutateAsync(formData);
      }
      onClose(true);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  console.log(!!terminal);
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {terminal
            ? t("biometricTerminals.editTerminal")
            : t("biometricTerminals.addTerminal")}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="device_no" className="text-sm font-medium">
            {t("biometricTerminals.terminalNumber")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            id="device_no"
            value={formData.device_no}
            onChange={(e) => handleChange("device_no", e.target.value)}
            placeholder={t("biometricTerminals.enterTerminalNumber")}
            className={errors.device_no ? "border-destructive" : ""}
          />
          {errors.device_no && (
            <p className="text-sm text-destructive">{errors.device_no}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="device_name" className="text-sm font-medium">
            {t("biometricTerminals.terminalName")}{" "}
            <span className="text-destructive">*</span>
          </label>
          <Input
            id="device_name"
            value={formData.device_name}
            onChange={(e) => handleChange("device_name", e.target.value)}
            placeholder={t("biometricTerminals.enterTerminalName")}
            className={errors.device_name ? "border-destructive" : ""}
          />
          {errors.device_name && (
            <p className="text-sm text-destructive">{errors.device_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="device_status" className="text-sm font-medium">
            {t("common.status")}
          </label>
          <Select
            value={formData.device_status.toString()}
            onValueChange={(value) =>
              handleChange("device_status", value === "true")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("common.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose(false)}
            disabled={
              mutations.createBiometricTerminal.isPending ||
              mutations.updateBiometricTerminal.isPending
            }
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={
              mutations.createBiometricTerminal.isPending ||
              mutations.updateBiometricTerminal.isPending
            }
          >
            {mutations.createBiometricTerminal.isPending ||
            mutations.updateBiometricTerminal.isPending
              ? t("common.saving")
              : terminal
              ? t("common.update")
              : t("common.create")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
