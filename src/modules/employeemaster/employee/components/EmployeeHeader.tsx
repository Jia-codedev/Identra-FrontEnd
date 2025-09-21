"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface EmployeesHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddEmployee: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  onIsManagerChange?: (isManager: boolean | null) => void;
  isManager?: boolean | null;
}

export const EmployeesHeader: React.FC<EmployeesHeaderProps> = ({
  search,
  onSearchChange,
  onAddEmployee,
  selectedCount,
  onDeleteSelected,
  onIsManagerChange,
  isManager,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 ">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t("employeeMaster.employee.title")}
          </h1>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div
            className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span
              className={`${
                isRTL ? "pr-2 pl-1" : "pl-2 pr-1"
              } text-xl text-primary/80`}
            >
              <Search size={22} />
            </span>
            <Input
              placeholder={t("employeeMaster.employee.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />
            {/* Manager filter */}
            {onIsManagerChange && (
              <div className="ml-2">
                <Select
                  value={
                    isManager === null
                      ? "all"
                      : isManager
                      ? "manager"
                      : "nonmanager"
                  }
                  onValueChange={(v) => {
                    if (v === "all") onIsManagerChange(null);
                    else if (v === "manager") onIsManagerChange(true);
                    else onIsManagerChange(false);
                  }}
                >
                  <SelectTrigger size="sm" className="w-36">
                    <SelectValue
                      placeholder={
                        t("employeeMaster.employee.filterManager") ||
                        t("common.all")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="manager">
                      {t("employeeMaster.employee.manager")}
                    </SelectItem>
                    <SelectItem value="nonmanager">
                      {t("employeeMaster.employee.nonManager") ?? "Non-manager"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <span className="mx-2 h-6 w-px bg-border" />
            {selectedCount > 0 && onDeleteSelected ? (
              <Button
                onClick={onDeleteSelected}
                className="font-semibold text-base px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 transition-all shadow-none"
                variant="destructive"
              >
                <span className="hidden sm:inline">{t("common.delete")}</span>
                <span className="sm:hidden text-xl leading-none">🗑️</span>
              </Button>
            ) : (
              <Button
                onClick={onAddEmployee}
                className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none"
                variant="default"
              >
                <span className="hidden sm:inline">+ {t("common.add")}</span>
                <span className="sm:hidden text-xl leading-none">+</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
