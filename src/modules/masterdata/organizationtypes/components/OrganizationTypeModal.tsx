"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IOrganizationType } from "../types";

interface OrganizationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IOrganizationType) => void;
  organizationType?: IOrganizationType | null;
  mode: "add" | "edit";
}

export const OrganizationTypeModal: React.FC<OrganizationTypeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  organizationType,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  type OrganizationTypeFormFields = {
    organization_type_eng: string | undefined;
    organization_type_arb: string | undefined;
    org_type_level: number;
  };

  const initialForm: OrganizationTypeFormFields = {
    organization_type_eng: "",
    organization_type_arb: "",
    org_type_level: 1,
  };
  const [formData, setFormData] =
    useState<OrganizationTypeFormFields>(initialForm);

  useEffect(() => {
    if (organizationType && mode === "edit") {
      setFormData({
        organization_type_eng:
          organizationType.organization_type_eng === ""
            ? undefined
            : organizationType.organization_type_eng,
        organization_type_arb:
          organizationType.organization_type_arb === ""
            ? undefined
            : organizationType.organization_type_arb,
        org_type_level: organizationType.org_type_level ?? 1,
      });
    } else {
      setFormData(initialForm);
    }
  }, [organizationType, mode, isOpen]);

  const disableSubmit =
    ((organizationType?.organization_type_eng ===
      formData.organization_type_eng &&
    organizationType?.organization_type_arb ===
      formData.organization_type_arb &&
    organizationType?.org_type_level === formData.org_type_level) ||
      (
        !formData.organization_type_eng &&
        !formData.organization_type_arb 
       
      )) ;



  const handleInputChange = (
    field: keyof OrganizationTypeFormFields,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "org_type_level" ? Number(value) || 1 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      org_type_level: Number(formData.org_type_level) || 1,
    };
    onSave(submissionData as any);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-background rounded-lg shadow-lg w-full max-w-md p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "add"
                ? t("masterData.organizationTypes.addOrganizationType")
                : t("masterData.organizationTypes.editOrganizationType")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 dark:bg-white/5 bg-black/5 rounded-xl p-2"
          >
            {isRTL ? (
              <div>
                <Label
                  htmlFor="organization_type_arb"
                  className="text-sm font-medium text-right w-full"
                >
                  {t("masterData.organizationTypes.organizationTypeNameArabic")}
                </Label>
                <Input
                  id="organization_type_arb"
                  value={formData.organization_type_arb}
                  onChange={(e) =>
                    handleInputChange("organization_type_arb", e.target.value)
                  }
                  placeholder={t(
                    "masterData.organizationTypes.enterOrganizationTypeNameArabic"
                  )}
                  className="mt-1 text-right"
                  dir="rtl"
                />
              </div>
            ) : (
              <div>
                <Label
                  htmlFor="organization_type_eng"
                  className="text-sm font-medium"
                >
                  {t(
                    "masterData.organizationTypes.organizationTypeNameEnglish"
                  )}{" "}
                  *
                </Label>
                <Input
                  id="organization_type_eng"
                  value={formData.organization_type_eng}
                  onChange={(e) =>
                    handleInputChange("organization_type_eng", e.target.value)
                  }
                  placeholder={t(
                    "masterData.organizationTypes.enterOrganizationTypeNameEnglish"
                  )}
                  required
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="org_type_level" className="text-sm font-medium">
                {t("masterData.organizationTypes.level")} *
              </Label>
              <Input
                id="org_type_level"
                type="number"
                value={formData.org_type_level}
                onChange={(e) =>
                  handleInputChange("org_type_level", e.target.value)
                }
                placeholder={t("masterData.organizationTypes.enterLevel")}
                min="1"
                step="1"
                required
                className="mt-1"
              />
            </div>
            <div
              className={`flex gap-3 pt-4 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={disableSubmit}>
                {t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
