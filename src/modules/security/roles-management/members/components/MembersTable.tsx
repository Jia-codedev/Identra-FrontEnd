"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { SecUserRole } from "@/services/security/secUserRoles";

interface MembersTableProps {
  members: SecUserRole[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectMember: (id: number) => void;
  onSelectAll: () => void;
  isLoading: boolean;
  onRemoveMember: (userRoleId: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectMember,
  onSelectAll,
  isLoading,
  onRemoveMember,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<SecUserRole>[] = [
    {
      key: "emp_no",
      header: t("security.roles.employeeNumber") || "Employee No",
      accessor: (item) => item.sec_users?.employee_master?.emp_no || "N/A",
    },
    {
      key: "employee_name",
      header: t("security.roles.employeeName") || "Employee Name",
      accessor: (item, isRTL) => {
        const employee = item.sec_users?.employee_master;
        if (!employee) return "N/A";

        return isRTL
          ? `${employee.firstname_arb || ""} ${
              employee.lastname_arb || ""
            }`.trim() || "N/A"
          : `${employee.firstname_eng || ""} ${
              employee.lastname_eng || ""
            }`.trim() || "N/A";
      },
    },
    {
      key: "organization",
      header: t("security.roles.organization") || "Organization",
      accessor: (item) => {
        const employee = item.sec_users?.employee_master as any;
        return employee?.organizations?.organization_name_eng || "N/A";
      },
    },
  ];

  return (
    <GenericTable
      data={members}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.user_role_id}
      getItemDisplayName={(item, isRTL) => {
        const employee = item.sec_users?.employee_master;
        if (!employee) return "Member";
        return isRTL
          ? `${employee.firstname_arb || ""} ${
              employee.lastname_arb || ""
            }`.trim()
          : `${employee.firstname_eng || ""} ${
              employee.lastname_eng || ""
            }`.trim();
      }}
      onSelectItem={(id) => onSelectMember(Number(id))}
      onSelectAll={onSelectAll}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("security.roles.noMembers") || "No members found"}
      isLoading={isLoading}
      showActions={false}
    />
  );
};
