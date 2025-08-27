"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";;
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface EmployeeGroupHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddEmployeeGroup: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
}

const EmployeeGroupHeader: React.FC<EmployeeGroupHeaderProps> = ({
  search,
  onSearchChange,
  onAddEmployeeGroup,
  selectedCount,
  onDeleteSelected,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        {/* Left section: Title and Description */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t("employeeMaster.employeeGroups.title")}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t("employeeMaster.employeeGroups.description")}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">
              {t("common.selectedCount", { count: selectedCount })}
            </p>
          )}
        </div>

        {/* Right section: Search + Buttons */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div
            className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Search Icon */}
            <span
              className={`${
                isRTL ? "pr-2 pl-1" : "pl-2 pr-1"
              } text-xl text-primary/80`}
            >
              <Search size={22} />
            </span>

            {/* Search Input */}
            <Input
              placeholder={t(
                "employeeMaster.employeeGroups.searchPlaceholder"
              )}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />

            {/* Divider */}
            <span className="mx-2 h-6 w-px bg-border" />

            {/* Conditional Button */}
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
                onClick={onAddEmployeeGroup}
                className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none"
                variant="default"
              >
                <span className="hidden sm:inline">
                  + {t("employeeMaster.employeeGroups.addEmployeeGroup")}
                </span>
                <span className="sm:hidden text-xl leading-none">+</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeGroupHeader;
