"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Search } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

interface EmailSettingsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddEmailSetting: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export const EmailSettingsHeader: React.FC<EmailSettingsHeaderProps> = ({
  search,
  onSearchChange,
  onAddEmailSetting,
  selectedCount,
  onDeleteSelected,
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("appSettings.alertPreferences.searchEmailSettings")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {t("common.deleteSelected", { count: selectedCount })}
          </Button>
        )}
      </div>
      <Button onClick={onAddEmailSetting} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("appSettings.alertPreferences.addEmailSetting")}
      </Button>
    </div>
  );
};