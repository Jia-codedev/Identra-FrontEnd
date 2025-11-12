"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserMinus } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import OrganizationCombobox from "@/components/ui/organization-combobox";

interface MembersHeaderProps {
  search: string;
  organizationFilter: number | null;
  onSearchChange: (value: string) => void;
  onOrganizationFilterChange: (value: number | null) => void;
  onAddMembers: () => void;
  onRemoveMembers: () => void;
  selectedCount: number;
}

export const MembersHeader: React.FC<MembersHeaderProps> = ({
  search,
  organizationFilter,
  onSearchChange,
  onOrganizationFilterChange,
  onAddMembers,
  onRemoveMembers,
  selectedCount,
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full sm:w-auto">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              t("security.roles.searchMembers") || "Search members..."
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Organization Filter */}
        <div className="w-full sm:w-64">
          <OrganizationCombobox
            value={organizationFilter}
            onChange={onOrganizationFilterChange}
            placeholder={
              t("common.filterByOrganization") || "Filter by organization"
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddMembers}
          size="sm"
          variant="default"
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {t("security.roles.addMembers") || "Add Members"}
        </Button>

        {selectedCount > 0 && (
          <Button
            onClick={onRemoveMembers}
            size="sm"
            variant="destructive"
            className="gap-2"
          >
            <UserMinus className="h-4 w-4" />
            {t("security.roles.removeSelected") || `Remove (${selectedCount})`}
          </Button>
        )}
      </div>
    </div>
  );
};
