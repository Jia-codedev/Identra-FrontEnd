"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";;
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import EmployeeCombobox from "@/components/ui/employee-combobox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { IDepartmentAdmin } from "../types";

interface DeptAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IDepartmentAdmin>) => void;
  deptAdmin?: IDepartmentAdmin | null;
  mode: "add" | "edit";
}

export const DeptAdminModal: React.FC<DeptAdminModalProps> = ({
  isOpen,
  onClose,
  onSave,
  deptAdmin,
  mode,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  type FormFields = {
    employee_id: number | string | null;
    from_date: string;
    to_date: string;
    delegation_level: string;
    active_status: boolean | string;
    remarks: string;
  };

  const initialForm: FormFields = {
    employee_id: null,
    from_date: "",
    to_date: "",
    delegation_level: "",
    active_status: true,
    remarks: "",
  };

  const [formData, setFormData] = useState<FormFields>(initialForm);
  const [fromDateObj, setFromDateObj] = useState<Date | undefined>(undefined);
  const [toDateObj, setToDateObj] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (deptAdmin && mode === "edit") {
      const formatDateForInput = (val: string | Date | null | undefined) => {
        if (!val) return "";
        try {
          const d = typeof val === "string" ? new Date(val) : val;
          if (d instanceof Date && !isNaN(d.getTime()))
            return d.toISOString().slice(0, 10);
          return "";
        } catch (e) {
          return "";
        }
      };

      setFormData({
        employee_id: deptAdmin.employee_id ?? null,
        from_date: formatDateForInput(deptAdmin.from_date),
        to_date: formatDateForInput(deptAdmin.to_date),
        delegation_level: String(deptAdmin.delegation_level ?? ""),
        active_status: String(deptAdmin.active_status ?? "true"),
        remarks: deptAdmin.remarks || "",
      });
      // initialize Date objects used by Calendar picker
      try {
        setFromDateObj(
          deptAdmin.from_date
            ? new Date(String(deptAdmin.from_date))
            : undefined
        );
      } catch (e) {
        setFromDateObj(undefined);
      }
      try {
        setToDateObj(
          deptAdmin.to_date ? new Date(String(deptAdmin.to_date)) : undefined
        );
      } catch (e) {
        setToDateObj(undefined);
      }
    } else {
      setFormData(initialForm);
      setFromDateObj(undefined);
      setToDateObj(undefined);
    }
  }, [deptAdmin, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<IDepartmentAdmin> = {
      employee_id: formData.employee_id
        ? Number(formData.employee_id)
        : undefined,
      from_date: fromDateObj ? fromDateObj.toISOString() : undefined,
      to_date: toDateObj ? toDateObj.toISOString() : undefined,
      delegation_level:
        formData.delegation_level !== "" &&
        formData.delegation_level !== null &&
        formData.delegation_level !== undefined
          ? Number.isNaN(Number(formData.delegation_level))
            ? undefined
            : Number(formData.delegation_level)
          : undefined,
      active_status:
        typeof formData.active_status === "string"
          ? formData.active_status === "true" || formData.active_status === "1"
          : Boolean(formData.active_status),
      remarks:
        formData.remarks && formData.remarks !== ""
          ? formData.remarks
          : undefined,
    };

    onSave(payload);
  };

  const handleInputChange = (field: keyof FormFields, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // using shared EmployeeCombobox component

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
          className="bg-background rounded-lg shadow-lg w-full max-w-lg p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "add"
                ? t("masterData.deptAdmins.add")
                : t("masterData.deptAdmins.edit") || t("common.edit")}
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
            className="space-y-4 bg-transparent rounded p-2"
          >
            <div>
              <Label htmlFor="employee_id" className="text-sm font-medium">
                {t("masterData.deptAdmins.employeeId")}
              </Label>
              <EmployeeCombobox
                value={
                  formData.employee_id ? Number(formData.employee_id) : null
                }
                onChange={(val) => handleInputChange("employee_id", val)}
                placeholder={t("masterData.deptAdmins.employeeId") || ""}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="from_date" className="text-sm font-medium">
                  {t("masterData.deptAdmins.from")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`w-full text-left border rounded px-3 py-2 mt-1 flex items-center justify-between ${
                        !fromDateObj ? "text-muted-foreground" : ""
                      }`}
                    >
                      <span>
                        {fromDateObj
                          ? format(fromDateObj, "PPP")
                          : t("common.selectDate") || "Select Date"}
                      </span>
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDateObj}
                      onSelect={(d) => {
                        setFromDateObj(d || undefined);
                        handleInputChange(
                          "from_date",
                          d ? d.toISOString().slice(0, 10) : ""
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="to_date" className="text-sm font-medium">
                  {t("masterData.deptAdmins.to")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`w-full text-left border rounded px-3 py-2 mt-1 flex items-center justify-between ${
                        !toDateObj ? "text-muted-foreground" : ""
                      }`}
                    >
                      <span>
                        {toDateObj
                          ? format(toDateObj, "PPP")
                          : t("common.selectDate") || "Select Date"}
                      </span>
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDateObj}
                      onSelect={(d) => {
                        setToDateObj(d || undefined);
                        handleInputChange(
                          "to_date",
                          d ? d.toISOString().slice(0, 10) : ""
                        );
                      }}
                      disabled={(date) =>
                        fromDateObj ? date < fromDateObj : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="delegation_level" className="text-sm font-medium">
                {t("masterData.deptAdmins.level")}
              </Label>
              <Input
                id="delegation_level"
                type="number"
                value={formData.delegation_level ?? ""}
                onChange={(e) =>
                  handleInputChange("delegation_level", e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="remarks" className="text-sm font-medium">
                {t("masterData.deptAdmins.remarks")}
              </Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
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

export default DeptAdminModal;
