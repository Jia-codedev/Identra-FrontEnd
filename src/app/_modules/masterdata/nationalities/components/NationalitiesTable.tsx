"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { INationality } from "../types";

interface NationalitiesTableProps {
  nationalities: INationality[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectNationality: (id: number) => void;
  onSelectAll: () => void;
  onEditNationality: (nationality: INationality) => void;
  onDeleteNationality: (id: number) => void;
  isLoading?: boolean;
}

export const NationalitiesTable: React.FC<NationalitiesTableProps> = ({
  nationalities,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectNationality,
  onSelectAll,
  onEditNationality,
  onDeleteNationality,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<INationality>[] = [
    {
      key: "name",
      header: t("masterData.nationalities.nationalityName"),
      accessor: (item, isRTL) => isRTL ? (item.citizenship_arb || "") : (item.citizenship_eng || ""),
    },
    {
      key: "code",
      header: t("masterData.nationalities.nationalityCode"),
      accessor: (item) => item.citizenship_code || "",
    },
  ];

  return (
    <GenericTable
      data={nationalities}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.citizenship_id}
      getItemDisplayName={(item, isRTL) => isRTL ? (item.citizenship_arb || "") : (item.citizenship_eng || "")}
      onSelectItem={onSelectNationality}
      onSelectAll={onSelectAll}
      onEditItem={onEditNationality}
      onDeleteItem={onDeleteNationality}
      noDataMessage={t("masterData.nationalities.noNationalitiesFound")}
      isLoading={isLoading}
    />
  );
};
