"use client";

import React from "react";
import { useTranslations } from "@/hooks/use-translations";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { IRegion } from "../types";

interface RegionsTableProps {
  regions: IRegion[];
  selected: number[];
  page: number;
  pageSize: number;
  allChecked: boolean;
  onSelectRegion: (id: number) => void;
  onSelectAll: () => void;
  onEditRegion: (region: IRegion) => void;
  onDeleteRegion: (id: number) => void;
  isLoading?: boolean;
}

export const RegionsTable: React.FC<RegionsTableProps> = ({
  regions,
  selected,
  page,
  pageSize,
  allChecked,
  onSelectRegion,
  onSelectAll,
  onEditRegion,
  onDeleteRegion,
  isLoading = false,
}) => {
  const { t } = useTranslations();

  const columns: TableColumn<IRegion>[] = [
    {
      key: "name",
      header: t("masterData.regions.regionName"),
      accessor: (item, isRTL) => isRTL ? (item.location_arb || "") : (item.location_eng || ""),
    },
    {
      key: "code",
      header: t("masterData.regions.regionCode"),
      accessor: (item) => item.location_code || "",
    },
  ];

  return (
    <GenericTable
      data={regions}
      columns={columns}
      selected={selected}
      page={page}
      pageSize={pageSize}
      allChecked={allChecked}
      getItemId={(item) => item.location_id}
      getItemDisplayName={(item, isRTL) => isRTL ? (item.location_arb || "") : (item.location_eng || "")}
      onSelectItem={onSelectRegion}
      onSelectAll={onSelectAll}
      onEditItem={onEditRegion}
      onDeleteItem={onDeleteRegion}
      noDataMessage={t("masterData.regions.noRegionsFound")}
      isLoading={isLoading}
    />
  );
};
