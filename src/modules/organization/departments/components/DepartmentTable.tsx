"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IDepartment } from "../types";

interface DepartmentTableProps {
  departments: IDepartment[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectDepartment: (id: number) => void;
  onSelectAll: () => void;
  onEditDepartment: (department: IDepartment) => void;
  onDeleteDepartment: (id: number) => void;
  isLoading?: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectDepartment,
  onSelectAll,
  onEditDepartment,
  onDeleteDepartment,
  isLoading,
  onPageChange,
  onPageSizeChange,
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IDepartment>[] = [
    {
      key: "code",
      header: t("masterData.departments.departmentCode"),
      accessor: (item) => item.department_code,
    },
    {
      key: "name",
      header: t("masterData.departments.departmentName"),
      accessor: (item, isRTL) =>
        isRTL ? item.department_name_arb : item.department_name_eng,
    },
  ];

  return (
    <GenericTable
      canEdit={canEdit}
      canDelete={canDelete}
      data={departments}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.department_id}
      getItemDisplayName={(item, isRTL) =>
        isRTL
          ? item.department_name_arb || item.department_name_eng || ""
          : item.department_name_eng || item.department_name_arb || ""
      }
      onSelectItem={(id) => onSelectDepartment(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditDepartment}
      onDeleteItem={(id) => onDeleteDepartment(Number(id))}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      noDataMessage={t("masterData.departments.noDepartmentsFound")}
      isLoading={isLoading}
    />
  );
};
