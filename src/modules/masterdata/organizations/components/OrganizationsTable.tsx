"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IOrganization } from "../types";

interface OrganizationsTableProps {
  organizations: IOrganization[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectOrganization: (id: number) => void;
  onSelectAll: () => void;
  onEditOrganization: (organization: IOrganization) => void;
  onDeleteOrganization: (id: number) => void;
  isLoading?: boolean;
}

export const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  organizations,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectOrganization,
  onSelectAll,
  onEditOrganization,
  onDeleteOrganization,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IOrganization>[] = [
    {
      key: "code",
      header: t("masterData.organizations.organizationCode"),
      accessor: (item) => item.organization_code || "",
    },
    {
      key: "name",
      header: t("masterData.organizations.organizationName"),
      accessor: (item, isRTL) =>
        isRTL ? item.organization_arb || "" : item.organization_eng || "",
    },
    {
      key: "parent",
      header: t("masterData.organizations.parentOrganization"),
      accessor: (item, isRTL) =>
        isRTL ? item.organizations?.organization_arb || "" : item.organizations?.organization_eng || "",
    },
  ];

  return (
    <GenericTable
      data={organizations}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.organization_id}
      getItemDisplayName={(item, isRTL) =>
        isRTL ? item.organization_arb || "" : item.organization_eng || ""
      }
      onSelectItem={onSelectOrganization}
      onSelectAll={onSelectAll}
      onEditItem={onEditOrganization}
      onDeleteItem={onDeleteOrganization}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("masterData.organizations.noOrganizationsFound")}
      isLoading={isLoading}
    />
  );
};
