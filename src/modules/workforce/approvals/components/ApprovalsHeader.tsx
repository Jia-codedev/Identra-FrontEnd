"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";

import { FiTrash2 } from "react-icons/fi";

interface ApprovalsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  filters: {
    approval_status: string;
    approver_id: string;
    request_id: string;
    employee_number: string;
    employee_name: string;
    from_date: string;
    to_date: string;
  };
  onFiltersChange: (filters: Partial<ApprovalsHeaderProps["filters"]>) => void;
}

export const ApprovalsHeader: React.FC<ApprovalsHeaderProps> = ({
  selectedCount,
  onDeleteSelected,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t("workforce.approvals.title") || "Workflow Approvals"}
          </h1>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex gap-2">
            {selectedCount > 0 && (
              <Button
                onClick={onDeleteSelected}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                {t("workforce.approvals.deleteSelected") ||
                  `Delete Selected (${selectedCount})`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
