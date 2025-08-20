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
    {
      key: "id",
      header: t("masterData.regions.id") || "ID",
      accessor: (item) => String(item.location_id ?? ""),
    },
    {
      key: "city",
      header: t("masterData.regions.city") || "City",
      accessor: (item) => item.city || "",
    },
    {
      key: "region_name",
      header: t("masterData.regions.region") || "Region",
      accessor: (item) => item.region_name || "",
    },
    {
      key: "country_code",
      header: t("masterData.regions.countryCode") || "Country",
      accessor: (item) => item.country_code || "",
    },
    {
      key: "geolocation",
      header: t("masterData.regions.geolocation") || "Geolocation",
      accessor: (item) => {
        if (item.geolocation === null || item.geolocation === undefined) return "";
        if (typeof item.geolocation === "string") return item.geolocation;
        try {
          return JSON.stringify(item.geolocation);
        } catch (e) {
          return String(item.geolocation);
        }
      },
    },
    {
      key: "radius",
      header: t("masterData.regions.radius") || "Radius",
      accessor: (item) => (item.radius === null || item.radius === undefined) ? "" : String(item.radius),
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
      onPageChange={(newPage) => console.log("Page changed to:", newPage)}
      onPageSizeChange={(newPageSize) => console.log("Page size changed to:", newPageSize)}
      noDataMessage={t("masterData.regions.noRegionsFound")}
      isLoading={isLoading}
    />
  );
};
