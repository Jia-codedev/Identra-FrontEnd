"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IEmployee } from "../types";
import { BanIcon, CheckIcon } from "lucide-react";
import designationsApi from "@/services/masterdata/designation";

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
  const [designationMap, setDesignationMap] = React.useState<
    Record<number, { eng: string; arb: string }>
  >({});

  React.useEffect(() => {
    let mounted = true;
    async function loadDesignations() {
      const ids = Array.from(
        new Set(employee.map((e) => e.designation_id).filter(Boolean))
      ) as number[];
      if (ids.length === 0) return;
      const map: Record<number, { eng: string; arb: string }> = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await designationsApi.getDesignationById(id);
            if (res && res.data) {
              map[id] = {
                eng: res.data.designation_name_eng || "",
                arb: res.data.designation_name_arb || "",
              };
            }
          } catch (e) {
          }
        })
      );
      if (mounted) setDesignationMap(map);
    }
    loadDesignations();
    return () => {
      mounted = false;
    };
  }, [employee]);

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
      key: "Email",
      header: t("employeeMaster.employee.email"),
      accessor: (item) => item.email || "",
    },
    {
      key: "JoinDate",
      header: t("employeeMaster.employee.joinDate"),
      accessor: (item) =>
        item.join_date
          ? typeof item.join_date === "string"
            ? item.join_date
            : item.join_date.toLocaleDateString()
          : "",
    },
    {
      key: "Designation",
      header: t("employeeMaster.employee.designation"),
      accessor: (item, isRTL) => {
        const id = item.designation_id;
        if (!id) return "";
        const d = designationMap[id];
        if (!d) return "";
        return isRTL ? d.arb : d.eng;
      },
    },
    {
      key: "Organization",
      header: t("employeeMaster.employee.organization"),
      accessor: (item) => item.organization_id || "",
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
