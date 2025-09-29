"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { IAppSetting } from "../types";

const appSettingSchema = z.object({
  version_name: z.string().min(1, "Version name is required").max(40, "Version name must not exceed 40 characters"),
  value: z.string().max(300, "Value must not exceed 300 characters").optional(),
  descr: z.string().max(300, "Description must not exceed 300 characters").optional(),
  tab_no: z.number().int("Tab number must be an integer").optional().or(z.literal("")),
});

type AppSettingFormData = z.infer<typeof appSettingSchema>;

interface AppSettingsModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  appSetting: IAppSetting | null;
  onClose: () => void;
  onSave: (data: IAppSetting) => void;
  isLoading?: boolean;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  isOpen,
  mode,
  appSetting,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AppSettingFormData>({
    resolver: zodResolver(appSettingSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && appSetting) {
        reset({
          version_name: appSetting.version_name,
          value: appSetting.value || "",
          descr: appSetting.descr || "",
          tab_no: appSetting.tab_no || "",
        });
      } else {
        reset({
          version_name: "",
          value: "",
          descr: "",
          tab_no: "",
        });
      }
    }
  }, [isOpen, mode, appSetting, reset]);

  const onSubmit = (data: AppSettingFormData) => {
    const submitData: IAppSetting = {
      ...appSetting,
      version_name: data.version_name,
      value: data.value || null,
      descr: data.descr || null,
      tab_no: data.tab_no === "" ? null : Number(data.tab_no),
    };

    onSave(submitData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? (t("appSettings.addTitle") || "Add App Setting")
              : (t("appSettings.editTitle") || "Edit App Setting")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Version Name */}
          <div className="space-y-2">
            <Label htmlFor="version_name">
              {t("appSettings.versionName") || "Version Name"} *
            </Label>
            <Input
              id="version_name"
              {...register("version_name")}
              placeholder={t("appSettings.versionNamePlaceholder") || "Enter version name"}
              className={errors.version_name ? "border-red-500" : ""}
            />
            {errors.version_name && (
              <p className="text-sm text-red-500">{errors.version_name.message}</p>
            )}
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value">
              {t("appSettings.value") || "Value"}
            </Label>
            <Input
              id="value"
              {...register("value")}
              placeholder={t("appSettings.valuePlaceholder") || "Enter value"}
              className={errors.value ? "border-red-500" : ""}
            />
            {errors.value && (
              <p className="text-sm text-red-500">{errors.value.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="descr">
              {t("appSettings.description") || "Description"}
            </Label>
            <Textarea
              id="descr"
              {...register("descr")}
              placeholder={t("appSettings.descriptionPlaceholder") || "Enter description"}
              className={errors.descr ? "border-red-500" : ""}
              rows={3}
            />
            {errors.descr && (
              <p className="text-sm text-red-500">{errors.descr.message}</p>
            )}
          </div>

          {/* Tab Number */}
          <div className="space-y-2">
            <Label htmlFor="tab_no">
              {t("appSettings.tabNo") || "Tab Number"}
            </Label>
            <Input
              id="tab_no"
              type="number"
              {...register("tab_no", {
                setValueAs: (value) => value === "" ? "" : Number(value),
              })}
              placeholder={t("appSettings.tabNoPlaceholder") || "Enter tab number"}
              className={errors.tab_no ? "border-red-500" : ""}
            />
            {errors.tab_no && (
              <p className="text-sm text-red-500">{errors.tab_no.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading
                ? (t("common.saving") || "Saving...")
                : mode === "add"
                ? (t("common.add") || "Add")
                : (t("common.save") || "Save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};