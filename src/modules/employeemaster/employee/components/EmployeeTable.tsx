"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IEmployee } from "../types";
import { BanIcon, CheckIcon } from "lucide-react";

interface EmployeesTableProps {
  employee: IEmployee[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectEmployee: (id: number) => void;
  onSelectAll: () => void;
  onEditEmployee: (employee: IEmployee) => void;
  onDeleteEmployee: (id: number) => void;
  isLoading?: boolean;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employee,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectEmployee,
  onSelectAll,
  onEditEmployee,
  onDeleteEmployee,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IEmployee>[] = [
    {
      key: "EmpNo",
      header: t("employeeMaster.employee.empNo"),
      accessor: (item) => item.emp_no,
    },
    {
      key: "name",
      header: t("employeeMaster.employee.employeeName"),
      accessor: (item, isRTL) =>
        isRTL
          ? item.firstname_arb + " " + item.lastname_arb
          : item.firstname_eng + " " + item.lastname_eng,
    },
    {
      key: "Manager",
      header: t("employeeMaster.employee.manager"),
      accessor: (item) =>
        item.manager_flag ? (
          <CheckIcon size={16} className="text-green-400" />
        ) : (
          <BanIcon size={16} className="text-destructive" />
        ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      accessor: () => null, // Actions handled by GenericTable
    },
  ];

  return (
  <GenericTable<IEmployee>
    data={employee}
    columns={columns}
    selected={selected}
    page={page}
    pageSize={pageSize}
    allChecked={allChecked}
    getItemId={(item) => item.employee_id!}
    getItemDisplayName={(item, isRTL) =>
      isRTL
        ? item.firstname_arb + " " + item.lastname_arb
        : item.firstname_eng + " " + item.lastname_eng
    }
    onSelectItem={onSelectEmployee}
    onSelectAll={onSelectAll}
    onEditItem={onEditEmployee}
    onDeleteItem={onDeleteEmployee}
    onPageChange={onPageChange}
    onPageSizeChange={onPageSizeChange}
    noDataMessage={t("employeeMaster.employee.noEmployeesFound")}
    isLoading={isLoading}
    showActions={true}
  />
  );
};
