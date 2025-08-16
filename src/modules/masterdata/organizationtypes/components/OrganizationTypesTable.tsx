"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IOrganizationType } from "../types";

interface OrganizationTypesTableProps {
  organizationTypes: IOrganizationType[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectOrganizationType: (id: number) => void;
  onSelectAll: () => void;
  onEditOrganizationType: (organizationType: IOrganizationType) => void;
  onDeleteOrganizationType: (id: number) => void;
  isLoading?: boolean;
}

export const OrganizationTypesTable: React.FC<OrganizationTypesTableProps> = ({
  organizationTypes,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectOrganizationType,
  onSelectAll,
  onEditOrganizationType,
  onDeleteOrganizationType,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IOrganizationType>[] = [
    {
      key: "name",
      header: t("masterData.organizationTypes.organizationTypeName"),
      accessor: (item, isRTL) => isRTL ? (item.organization_type_arb || "") : (item.organization_type_eng || ""),
    },
    {
      key: "level",
      header: t("masterData.organizationTypes.level"),
      accessor: (item) => item.org_type_level || "",
    },
  ];
  console.log("OrganizationTypesTable rendered with data:", organizationTypes);
  return (
    <GenericTable
      data={organizationTypes}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.organization_type_id}
      getItemDisplayName={(item, isRTL) => isRTL ? (item.organization_type_arb || "") : (item.organization_type_eng || "")}
      onSelectItem={onSelectOrganizationType}
      onSelectAll={onSelectAll}
      onEditItem={onEditOrganizationType}
      onDeleteItem={onDeleteOrganizationType}
      noDataMessage={t("masterData.organizationTypes.noOrganizationTypesFound")}
      isLoading={isLoading}
    />
  );
};
