"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IDesignation } from "../types";

interface DesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IDesignation) => void;
  designation?: IDesignation | null;
  mode: "add" | "edit";
}

export const DesignationModal: React.FC<DesignationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  designation,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  type DesignationFormFields = {
    designation_eng: string;
    designation_code: string;
    designation_arb: string;
  };

  const initialForm: DesignationFormFields = {
    designation_eng: "",
    designation_code: "",
    designation_arb: "",
  };

  const [formData, setFormData] = useState<DesignationFormFields>(initialForm);

  useEffect(() => {
    if (designation && mode === "edit") {
      setFormData({
        designation_eng: designation.designation_eng || "",
        designation_code: designation.designation_code || "",
        designation_arb: designation.designation_arb || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [designation, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (
    field: keyof DesignationFormFields,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "add"
                ? t("masterData.designations.addDesignation")
                : t("masterData.designations.editDesignation")}
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
            <div>
              <Label htmlFor="designation_code" className="text-sm font-medium">
                {t("masterData.designations.designationCode")} *
              </Label>
              <Input
                id="designation_code"
                value={formData.designation_code}
                onChange={(e) =>
                  handleInputChange("designation_code", e.target.value.toUpperCase())
                }
                placeholder={t("masterData.designations.enterDesignationCode")}
                required
                className="mt-1"
              />
            </div>
            {isRTL ? (
              <div>
                <Label htmlFor="designation_arb" className="text-sm font-medium">
                  {t("masterData.designations.designationNameArabic")}
                </Label>
                <Input
                  id="designation_arb"
                  value={formData.designation_arb}
                  onChange={(e) =>
                    handleInputChange("designation_arb", e.target.value)
                  }
                  placeholder={t("masterData.designations.enterDesignationNameArabic")}
                  className="mt-1"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="designation_eng" className="text-sm font-medium">
                  {t("masterData.designations.designationName")} *
                </Label>
                <Input
                  id="designation_eng"
                  value={formData.designation_eng}
                  onChange={(e) =>
                    handleInputChange("designation_eng", e.target.value)
                  }
                  placeholder={t("masterData.designations.enterDesignationName")}
                  required
                  className="mt-1"
                />
              </div>
            )}

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
              <Button type="submit" className="flex-1">
                {t("common.save")}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
