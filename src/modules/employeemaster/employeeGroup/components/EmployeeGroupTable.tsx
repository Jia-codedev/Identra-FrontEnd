"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IEmployeeGroup } from "../types";
import { BanIcon, BlocksIcon, Check, CheckIcon } from "lucide-react";

interface EmployeeGroupTableProps {
  employeeGroups: IEmployeeGroup[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectEmployeeGroup: (id: string | number) => void;
  onSelectAll: () => void;
  onEditEmployeeGroup: (employeeGroup: IEmployeeGroup) => void;
  onDeleteEmployeeGroup: (id: string | number) => void;
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
      key: "code",
      header: t("employeeMaster.employeeGroups.employeeGroupCode"),
      accessor: (item) => item.group_code,
    },
    {
      key: "name",
      header: t("employeeMaster.employeeGroups.employeeGroupName"),
      accessor: (item, isRTL) =>
        isRTL ? item.group_name_arb : item.group_name_eng,
    },
    {
      key: "startDate",
      header: t("employeeMaster.employeeGroups.employeeGroupStartDate"),
      accessor: (item) =>
        item.group_start_date
          ? typeof item.group_start_date === "string"
            ? new Date(item.group_start_date).toLocaleDateString()
            : item.group_start_date.toLocaleDateString()
          : "",
    },
    {
      key: "endDate",
      header: t("employeeMaster.employeeGroups.employeeGroupEndDate"),
      accessor: (item) =>
        item.group_end_date
          ? typeof item.group_end_date === "string"
            ? new Date(item.group_end_date).toLocaleDateString()
            : item.group_end_date.toLocaleDateString()
          : "",
    },
    {
      key: "reporting",
      header: t("employeeMaster.employeeGroups.employeeGroupReporting"),
      accessor: (item) =>
        item.reporting_group_flag ? (
          <CheckIcon size={16} className="text-green-400" />
        ) : (
          <BanIcon size={16} className="text-destructive" />
        ),
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
      showActions={true}
    />
  );
};

export default EmployeeGroupTable;
