"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";

type DeptAdmin = {
  dept_admin_id: number;
  employee_id: number | string;
  from_date: string | Date;
  to_date: string | Date;
  delegation_level?: number;
  active_status?: boolean;
  remarks?: string;
};

interface DeptAdminsTableProps {
  data: DeptAdmin[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  getItemId?: (item: DeptAdmin) => number;
  getItemDisplayName?: (item: DeptAdmin, isRTL: boolean) => string;
  onSelectItem: (id: number) => void;
  onSelectAll: () => void;
  onEditItem?: (item: DeptAdmin) => void;
  onDeleteItem?: (id: number) => void;
  noDataMessage?: string;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function DeptAdminsTable({
  data,
  selected,
  page,
  pageSize,
  allChecked,
  getItemId,
  getItemDisplayName,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDeleteItem,
  noDataMessage,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: DeptAdminsTableProps) {
  const { t } = useTranslations();

  const columns: TableColumn<DeptAdmin>[] = [
    {
      key: "employee_id",
      header: t("masterData.deptAdmins.employeeId") || "Employee ID",
      accessor: (item) => String(item.employee_id || ""),
    },
    {
      key: "from_date",
      header: t("masterData.deptAdmins.from") || "From",
      accessor: (item) =>
        item.from_date ? new Date(item.from_date).toLocaleDateString() : "",
    },
    {
      key: "to_date",
      header: t("masterData.deptAdmins.to") || "To",
      accessor: (item) =>
        item.to_date ? new Date(item.to_date).toLocaleDateString() : "",
    },
    {
      key: "delegation_level",
      header: t("masterData.deptAdmins.level") || "Level",
      accessor: (item) => item.delegation_level ?? "",
    },
    {
      key: "active_status",
      header: t("masterData.deptAdmins.active") || "Active",
      accessor: (item) =>
        item.active_status ? t("common.yes") || "Yes" : t("common.no") || "No",
    },
    {
      key: "remarks",
      header: t("masterData.deptAdmins.remarks") || "Remarks",
      accessor: (item) => item.remarks || "",
    },
  ];

  const idFn = getItemId || ((item: DeptAdmin) => item.dept_admin_id);
  const displayNameFn =
    getItemDisplayName || ((item: DeptAdmin) => String(item.employee_id || ""));

  return (
    <GenericTable
      data={data}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={idFn}
      getItemDisplayName={displayNameFn}
      onSelectItem={(id) => onSelectItem && onSelectItem(Number(id))}
      onSelectAll={onSelectAll}
      onEditItem={onEditItem || (() => {})}
      onDeleteItem={(id) => onDeleteItem && onDeleteItem(Number(id))}
      noDataMessage={
        noDataMessage || t("masterData.deptAdmins.noData") || "No records found"
      }
      isLoading={isLoading}
      onPageChange={onPageChange || (() => {})}
      onPageSizeChange={onPageSizeChange || (() => {})}
    />
  );
}
