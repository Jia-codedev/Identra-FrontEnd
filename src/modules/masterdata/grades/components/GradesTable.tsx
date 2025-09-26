"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IGrade } from "../types";

interface GradesTableProps {
  grades: IGrade[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectGrade: (id: number) => void;
  onSelectAll: () => void;
  onEditGrade: (grade: IGrade) => void;
  onDeleteGrade: (id: number) => void;
  isLoading?: boolean;
}

export const GradesTable: React.FC<GradesTableProps> = ({
  grades,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectGrade,
  onSelectAll,
  onEditGrade,
  onDeleteGrade,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IGrade>[] = [
    {
      key: "code",
      header: t("masterData.grade.gradeCode"),
      accessor: (item) => item.grade_code,
    },
    {
      key: "name",
      header: t("masterData.grade.gradeName"),
      accessor: (item, isRTL) => isRTL ? item.grade_arb : item.grade_eng,
    },
  ];

  return (
    <GenericTable
      data={grades}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.grade_id}
      getItemDisplayName={(item, isRTL) => isRTL ? item.grade_arb || item.grade_eng || "" : item.grade_eng || item.grade_arb || ""}
      onSelectItem={onSelectGrade}
      onSelectAll={onSelectAll}
      onEditItem={onEditGrade}
      onDeleteItem={onDeleteGrade}
  onPageChange={onPageChange}
  onPageSizeChange={onPageSizeChange}
      noDataMessage={t("masterData.grade.noGradesFound")}
      isLoading={isLoading}
    />
  );
};
