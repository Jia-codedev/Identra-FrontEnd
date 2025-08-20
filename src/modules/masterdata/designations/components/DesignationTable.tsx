"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IDesignation } from "../types";

interface DesignationsTableProps {
  designations: IDesignation[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectDesignation: (id: number) => void;
  onSelectAll: () => void;
  onEditDesignation: (designation: IDesignation) => void;
  onDeleteDesignation: (id: number) => void;
  isLoading?: boolean;
}

export const DesignationsTable: React.FC<DesignationsTableProps> = ({
  designations,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectDesignation,
  onSelectAll,
  onEditDesignation,
  onDeleteDesignation,
  isLoading,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IDesignation>[] = [
    {
      key: "name",
      header: t("masterData.designations.designationName"),
      accessor: (item, isRTL) => isRTL ? item.designation_arb : item.designation_eng,
    },
    {
      key: "code",
      header: t("masterData.designations.designationCode"),
      accessor: (item) => item.designation_code,
    },
  ];

  return (
    <GenericTable
      data={designations}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.designation_id}
      getItemDisplayName={(item, isRTL) => isRTL ? item.designation_arb || item.designation_eng || "" : item.designation_eng || item.designation_arb || ""}
      onSelectItem={onSelectDesignation}
      onSelectAll={onSelectAll}
      onEditItem={onEditDesignation}
      onDeleteItem={onDeleteDesignation}
  onPageChange={onPageChange}
  onPageSizeChange={onPageSizeChange}
      noDataMessage={t("masterData.designations.noDesignationsFound")}
      isLoading={isLoading}
    />
  );
};
