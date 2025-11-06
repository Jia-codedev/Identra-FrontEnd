"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IEmployeeType } from "../types";

interface EmployeeTypesTableProps {
  employeeTypes: IEmployeeType[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectEmployeeType: (id: string | number) => void;
  onSelectAll: () => void;
  onEditEmployeeType: (employeeType: IEmployeeType) => void;
  onDeleteEmployeeType: (id: string | number) => void;
  isLoading?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const EmployeeTypesTable: React.FC<EmployeeTypesTableProps> = ({
  employeeTypes,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectEmployeeType,
  onSelectAll,
  onEditEmployeeType,
  onDeleteEmployeeType,
  isLoading,
  onPageChange,
  onPageSizeChange,
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IEmployeeType>[] = [
    {
      key: "code",
      header: t("employeeMaster.employeeTypes.employeeTypeCode"),
      accessor: (item) => item.employee_type_code,
    },
    {
      key: "name",
      header: t("employeeMaster.employeeTypes.employeeTypeName"),
      accessor: (item, isRTL) =>
        isRTL ? item.employee_type_arb : item.employee_type_eng,
    },
  ];

  return (
    <GenericTable
      canEdit={canEdit}
      canDelete={canDelete}
      data={employeeTypes}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.employee_type_id}
      getItemDisplayName={(item, isRTL) =>
        isRTL
          ? item.employee_type_arb || item.employee_type_eng || ""
          : item.employee_type_eng || item.employee_type_arb || ""
      }
      onSelectItem={onSelectEmployeeType}
      onSelectAll={onSelectAll}
      onEditItem={onEditEmployeeType}
      onDeleteItem={onDeleteEmployeeType}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("employeeMaster.employeeTypes.noEmployeeTypesFound")}
      isLoading={isLoading}
    />
  );
};
