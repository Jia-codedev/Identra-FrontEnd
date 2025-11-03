"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { SecRole } from "@/services/security/securityRoles";

interface RolesTableProps {
  roles: SecRole[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectRole: (id: number) => void;
  onSelectAll: () => void;
  onEditRole: (role: SecRole) => void;
  onDeleteRole: (id: number) => void;
  isLoading?: boolean;
}

export const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectRole,
  onSelectAll,
  onEditRole,
  onDeleteRole,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<SecRole>[] = [
    {
      key: "role_name",
      header: t("security.roles.roleName") || "Role Name",
      accessor: (item) => item.role_name,
    },
    {
      key: "editable_flag",
      header: t("security.roles.status") || "Status",
      accessor: (item) =>
        item.editable_flag ? t("common.editable") : t("common.readOnly"),
    },
  ];

  return (
    <GenericTable
      data={roles}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.role_id}
      getItemDisplayName={(item) => item.role_name}
      onSelectItem={(id) => onSelectRole(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditRole}
      onDeleteItem={(id) => onDeleteRole(Number(id))}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("security.roles.noRolesFound") || "No roles found"}
      isLoading={isLoading}
    />
  );
};
