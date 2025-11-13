"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IDepartment } from "../types";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IDepartment) => void;
  department?: IDepartment | null;
  mode: "add" | "edit";
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  department,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  type DepartmentFormFields = {
    department_code: string;
    department_name_eng: string;
    department_name_arb: string;
  };

  const initialForm: DepartmentFormFields = {
    department_code: "",
    department_name_eng: "",
    department_name_arb: "",
  };

  const [formData, setFormData] = useState<DepartmentFormFields>(initialForm);

  useEffect(() => {
    if (department && mode === "edit") {
      setFormData({
        department_code: department.department_code || "",
        department_name_eng: department.department_name_eng || "",
        department_name_arb: department.department_name_arb || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [department, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
  };

  const handleInputChange = (
    field: keyof DepartmentFormFields,
    value: string
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
                ? t("masterData.departments.addDepartment")
                : t("masterData.departments.editDepartment")}
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
              <Label htmlFor="department_code" className="text-sm font-medium">
                {t("masterData.departments.departmentCode")} *
              </Label>
              <Input
                id="department_code"
                value={formData.department_code}
                onChange={(e) =>
                  handleInputChange(
                    "department_code",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder={t("masterData.departments.enterDepartmentCode")}
                required
                className="mt-1"
                disabled={mode === "edit"}
              />
            </div>

            {isRTL ? (
              <div>
                <Label
                  htmlFor="department_name_arb"
                  className="text-sm font-medium"
                >
                  {t("masterData.departments.departmentName")} *
                </Label>
                <Input
                  id="department_name_arb"
                  value={formData.department_name_arb}
                  onChange={(e) =>
                    handleInputChange("department_name_arb", e.target.value)
                  }
                  placeholder={t("masterData.departments.enterDepartmentName")}
                  required
                  className="mt-1"
                />
              </div>
            ) : (
              <div>
                <Label
                  htmlFor="department_name_eng"
                  className="text-sm font-medium"
                >
                  {t("masterData.departments.departmentName")} *
                </Label>
                <Input
                  id="department_name_eng"
                  value={formData.department_name_eng}
                  onChange={(e) =>
                    handleInputChange("department_name_eng", e.target.value)
                  }
                  placeholder={t("masterData.departments.enterDepartmentName")}
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
