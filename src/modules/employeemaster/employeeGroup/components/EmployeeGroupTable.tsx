"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IEmployeeGroup } from "../types";

interface EmployeeGroupTableProps {
  employeeGroups: IEmployeeGroup[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectEmployeeGroup: (id: number) => void;
  onSelectAll: () => void;
  onEditEmployeeGroup: (employeeGroup: IEmployeeGroup) => void;
  onDeleteEmployeeGroup: (id: number) => void;
  isLoading?: boolean;
}

export const EmployeeGroupTable: React.FC<EmployeeGroupTableProps> = ({
  employeeGroups,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectEmployeeGroup,
  onSelectAll,
  onEditEmployeeGroup,
  onDeleteEmployeeGroup,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IEmployeeGroup>[] = [
    {
      key: "name",
      header: t("employeeMaster.employeeGroups.employeeGroupName"),
      accessor: (item, isRTL) =>
        isRTL ? item.group_name_arb : item.group_name_eng,
    },
    {
      key: "code",
      header: t("employeeMaster.employeeGroups.employeeGroupCode"),
      accessor: (item) => item.group_code,
    },
  ];

  return (
    <GenericTable
      data={employeeGroups}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.employee_group_id || 0}
      getItemDisplayName={(item, isRTL) =>
        isRTL
          ? item.group_name_arb || item.group_name_eng || ""
          : item.group_name_eng || item.group_name_arb || ""
      }
      onSelectItem={onSelectEmployeeGroup}
      onSelectAll={onSelectAll}
      onEditItem={onEditEmployeeGroup}
      onDeleteItem={onDeleteEmployeeGroup}
  onPageChange={onPageChange}
  onPageSizeChange={onPageSizeChange}
      noDataMessage={t("employeeMaster.employeeGroups.noEmployeeGroupsFound")}
      isLoading={isLoading}
    />
  );
};

export default EmployeeGroupTable;
